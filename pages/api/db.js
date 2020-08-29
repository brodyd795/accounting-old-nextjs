const mysql = require("serverless-mysql");
const escape = require("sql-template-strings");
require("dotenv").config();

const db = mysql({
	config: {
		host: process.env.DB_HOST,
		database: process.env.DB_NAME,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
	},
});

const insertTransaction = async (transaction) => {
	let {
		id,
		userEmail,
		toAccount,
		fromAccount,
		amount,
		toBalance,
		fromBalance,
		comment,
	} = transaction;
	await db.query(
		escape`INSERT INTO transactions VALUES(${id}, ${userEmail}, ${fromAccount}, ${toAccount}, ${amount}, ${fromBalance}, ${toBalance}, ${comment})`
	);
	await db.query(
		escape`UPDATE transactions SET to_balance = to_balance + ${amount} WHERE trn_id > ${id} AND (to_account = ${toAccount} OR to_account = ${fromAccount})`
	);
	await db.query(
		escape`UPDATE transactions SET from_balance = from_balance - ${amount} WHERE trn_id > ${id} AND (from_account = ${toAccount} OR from_account = ${fromAccount})`
	);

	await db.quit();
	return "OK";
};

const getTransaction = async (id) => {
	let results = await db.query(
		escape`SELECT * FROM first WHERE TransactionId=${id}`
	);
	await db.quit();
	return results;
};

/*
 * Gets most recent id from database, either absolutely or for a given date.
 * Returns date if date is provided but not found in database.
 * @param	Int	[date]	Date
 * @return 	Int 		Most recent id
 */
const getLastId = async (date) => {
	let lastId;

	if (date) {
		lastId = await db.query(
			escape`SELECT MAX(TransactionId) max_id FROM first WHERE TransactionId BETWEEN ${date} AND ${
				date + 99
			}`
		);
	} else {
		lastId = await db.query(`SELECT MAX(trn_id) max_id FROM transactions`);
	}

	lastId = lastId[0]["max_id"] || date;
	await db.quit();
	return lastId;
};

const getTransactionIdentifiers = async () => {
	const rows = await db.query(`SELECT * FROM transaction_identifiers`);
	await db.quit();

	const identifiers = {
		fastFoodLocations: [],
		gasLocations: [],
		groceryLocations: [],
		rentAmount: null,
		carPaymentAmount: null,
		salaryAmount: null,
	};
	rows.map((row) => {
		const { trn_type, trn_identifier } = row;

		switch (trn_type) {
			case "restaurant":
				identifiers.fastFoodLocations.push(trn_identifier);
				break;
			case "gas":
				identifiers.gasLocations.push(trn_identifier);
				break;
			case "grocery":
				identifiers.groceryLocations.push(trn_identifier);
				break;
			case "rent":
				identifiers.rentAmount = trn_identifier;
				break;
			case "carPayment":
				identifiers.carPaymentAmount = trn_identifier;
				break;
			case "salary":
				identifiers.salaryAmount = trn_identifier;
				break;
		}
	});

	return identifiers;
};

const getAll = async (isAdmin) => {
	if (isAdmin) {
		let results = await db.query(
			escape`SELECT * FROM transactions ORDER BY trn_id desc`
		);
		await db.quit();
		return results;
	}
	return { message: "error" };
};

const getAllAccountBalances = async (isAdmin) => {
	let balances = {};
	let accounts = await db.query(
		escape`SELECT acc_name FROM accounts WHERE open = true`
	);
	for (let account of accounts) {
		const name = account.acc_name;
		const lastDebit = await db.query(escape`
			SELECT to_balance FROM transactions where to_account=${name} order by trn_id desc limit 1;
		`);
		const lastCredit = await db.query(escape`
	  		SELECT from_balance FROM transactions where from_account=${name} order by trn_id desc limit 1;
		`);
		await db.quit();

		// has the account had *both* debits and credits?
		if (lastDebit.length > 0 && lastCredit.length > 0) {
			// if the most recent debit is more recent than the most recent credit
			if (lastDebit.id > lastCredit.id) {
				balances[name] = lastDebit[0]["to_balance"];
			} else {
				balances[name] = lastCredit[0]["from_balance"];
			}
			// has it had any debits?
		} else if (lastDebit.length > 0) {
			balances[name] = lastDebit[0]["to_balance"];
			// has it had any credits?
		} else if (lastCredit.length > 0) {
			balances[name] = lastCredit[0]["from_balance"];
			// it hasn't had any transactions before
		} else {
			balances[name] = 0;
		}
	}
	return summarizeAllAccountBalances(balances);
};

const summarizeAllAccountBalances = async (balances) => {
	let categories = {
		income: {},
		expenses: {},
		assets: {},
		liabilities: {},
		virtualSavings: {},
	};
	Object.entries(balances).map(([key, value]) => {
		switch (key[0]) {
			case "I":
				categories.income[key] = value;
				break;
			case "E":
				categories.expenses[key] = value;
				break;
			case "A":
				categories.assets[key] = value;
				break;
			case "L":
				categories.liabilities[key] = value;
				break;
			case "V":
				categories.virtualSavings[key] = value;
				break;
		}
	});
	const cleanData = {};
	Object.entries(categories).map(([category, accounts]) => {
		const cleanCategory =
			category[0].toUpperCase() + category.replace(/([A-Z])/, " $1").slice(1);
		const categorySum = String(
			Object.values(accounts).reduce((a, b) => a + b, 0)
		).replace(/(\.\d\d)\d*/, "$1");
		cleanData[cleanCategory] = {
			balance: categorySum,
			accounts: {},
		};

		Object.entries(accounts).map(([account, balance]) => {
			const cleanAccount = account.slice(2).replace(/_/g, " ");
			let cleanBalance = String(balance);
			if (cleanBalance === "0") {
				// do nothing
			} else if (/\.\d$/.test(cleanBalance)) {
				cleanBalance = cleanBalance.concat("0");
			} else if (/^[^.]$/.test(cleanBalance)) {
				cleanBalance = cleanBalance.concat(".00");
			}
			// cleanData[cleanCategory]["accounts"][cleanAccount] = cleanBalance;
			cleanData[cleanCategory]["accounts"][account] = {
				name: cleanAccount,
				balance: cleanBalance,
			};
		});
	});
	return cleanData;
};

const getAccountsList = async () => {
	let accounts = await db.query(
		escape`SELECT acc_name FROM accounts WHERE open = true`
	);
	await db.quit();
	return accounts;
};

const getLastAccountBalances = async (toAccount, fromAccount, id) => {
	let lastAccountBalances = {};
	let toAccountResults = await db.query(escape`
    	SELECT to_account, from_account, to_balance, from_balance FROM transactions WHERE (to_account = ${toAccount} OR from_account = ${toAccount}) AND (trn_id < ${id}) ORDER BY trn_id desc limit 1
	`);
	let fromAccountResults = await db.query(escape`
		SELECT to_account, from_account, to_balance, from_balance FROM transactions WHERE (to_account = ${fromAccount} OR from_account = ${fromAccount}) AND (trn_id < ${id}) ORDER BY trn_id desc limit 1
	`);
	if (toAccountResults.length > 0) {
		if (toAccountResults[0].to_account === toAccount) {
			lastAccountBalances.toAccount = toAccountResults[0].to_balance;
		} else {
			lastAccountBalances.toAccount = toAccountResults[0].from_balance;
		}
	} else {
		lastAccountBalances.toAccount = 0;
	}

	if (fromAccountResults.length > 0) {
		if (fromAccountResults[0].to_account === fromAccount) {
			lastAccountBalances.fromAccount = fromAccountResults[0].to_balance;
		} else {
			lastAccountBalances.fromAccount = fromAccountResults[0].from_balance;
		}
	} else {
		lastAccountBalances.fromAccount = 0;
	}

	await db.quit();
	return lastAccountBalances;
};

const getAccountTransactions = async (account) => {
	let results = await db.query(
		escape`SELECT * FROM transactions WHERE from_account=${account} OR to_account=${account} ORDER BY trn_id desc`
	);
	await db.quit();
	return results;
};

const search = async (params) => {
	let {
		toAccount,
		fromAccount,
		dateRange,
		fromAmount,
		toAmount,
		keyword,
	} = params;

	let query = [];

	if (toAccount !== "" && toAccount !== null) {
		query.push(`Debit='${toAccount.value}'`);
	}
	if (fromAccount !== "" && fromAccount !== null) {
		query.push(`Credit='${fromAccount.value}'`);
	}
	if (dateRange !== "") {
		query.push(
			`TransactionId>=${dateRange.start} AND TransactionId<${dateRange.end}`
		);
	}
	if (fromAmount !== "") {
		fromAmount = parseInt(fromAmount.replace(/[$.]/g, ""));
		query.push(`Amount>=${fromAmount}`);
	}
	if (toAmount !== "") {
		toAmount = parseInt(toAmount.replace(/[$.]/g, ""));
		query.push(`Amount<=${toAmount}`);
	}
	if (keyword !== "") {
		keyword = keyword.toLowerCase();
		query.push(
			`Debit COLLATE UTF8_GENERAL_CI LIKE '%${keyword}%' OR Credit COLLATE UTF8_GENERAL_CI LIKE '%${keyword}%' OR Description COLLATE UTF8_GENERAL_CI LIKE '%${keyword}%'`
		);
	}

	query = query.join(" AND ");

	let results = await db.query("SELECT * FROM first WHERE " + query);

	await db.quit();
	return results;
};

const deleteTransaction = async (data) => {
	let { id, amount, debit, credit } = data;
	try {
		let result = await db.query(
			escape`DELETE FROM first WHERE TransactionId=${id}`
		);
		await db.query(
			escape`UPDATE first SET DebitBalance = DebitBalance - ${amount} WHERE TransactionId > ${id} AND (Debit = ${debit} OR Debit = ${credit})`
		);
		await db.query(
			escape`UPDATE first SET CreditBalance = CreditBalance + ${amount} WHERE TransactionId > ${id} AND (Credit = ${debit} OR Credit = ${credit})`
		);
		await db.quit();
		return "ok";
	} catch (err) {
		await db.quit();
		return err;
	}
};

module.exports = {
	getLastId: getLastId,
	insertTransaction: insertTransaction,
	getLastAccountBalances: getLastAccountBalances,
	getAll: getAll,
	getAllAccountBalances: getAllAccountBalances,
	getAccountTransactions: getAccountTransactions,
	search: search,
	getTransaction: getTransaction,
	deleteTransaction: deleteTransaction,
	getTransactionIdentifiers: getTransactionIdentifiers,
	getAccountsList: getAccountsList,
};

// old function to rebalance full transaction history
// const rebalance = async (id, account, amount) => {
// 	await mysql.query(escape``);

// let prevBalances = {};
// for (let account of Accounts.open) {
// 	let lastDebit = await mysql.query(escape`
//   SELECT DebitBalance FROM first where Debit=${account} AND TransactionId<${id} order by transactionId desc limit 1;
// `);
// 	let lastCredit = await mysql.query(escape`
//   SELECT CreditBalance FROM first where Credit=${account} AND TransactionId<${id} order by transactionId desc limit 1;
// `);

// 	// has the account had *both* debits and credits?
// 	if (lastDebit.length > 0 && lastCredit.length > 0) {
// 		// if the most recent debit is more recent than the most recent credit
// 		if (lastDebit.TransactionId > lastCredit.TransactionId) {
// 			prevBalances[account] = lastDebit[0]["DebitBalance"];
// 		} else {
// 			prevBalances[account] = lastCredit[0]["CreditBalance"];
// 		}
// 		// has it had any debits?
// 	} else if (lastDebit.length > 0) {
// 		prevBalances[account] = lastDebit[0]["DebitBalance"];
// 		// has it had any credits?
// 	} else if (lastCredit.length > 0) {
// 		prevBalances[account] = lastCredit[0]["CreditBalance"];
// 		// it hasn't had any transactions before
// 	} else {
// 		prevBalances[account] = 0;
// 	}
// }

// let rowsToUpdate = await mysql.query(
// 	escape`SELECT * FROM first WHERE TransactionId>=${id}`
// );

// for (let row of rowsToUpdate) {
// 	let { Debit, Credit, Amount } = row;
// 	let newDebitBalance = prevBalances[Debit] + Amount;
// 	let newCreditBalance = prevBalances[Credit] - Amount;

// 	row.DebitBalance = newDebitBalance;
// 	row.CreditBalance = newCreditBalance;
// 	prevBalances[Debit] = newDebitBalance;
// 	prevBalances[Credit] = newCreditBalance;
// }

// let rowsToInsert = [];
// for (let row of rowsToUpdate) {
// 	rowsToInsert.push(Object.values(row));
// }

// await mysql.query(escape`DELETE FROM first WHERE TransactionId>=${id}`);
// await mysql.query(escape`INSERT INTO first VALUES ${rowsToInsert}`);

// 	await mysql.quit();
// 	return;
// };
