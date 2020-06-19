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

// old way of sending a specific query to this file

// exports.query = async (query) => {
// 	try {
// 		const results = await db.query(query);
// 		await db.end();
// 		return results;
// 	} catch (error) {
// 		return { error };
// 	}
// };

// how to config it on remote server
// require("dotenv").config({ path: "../../.env" });

// old way of doing the config
// mysql.config({
// 	host: process.env.MYSQL_HOST,
// 	database: process.env.MYSQL_DATABASE,
// 	user: process.env.MYSQL_USER,
// 	password: process.env.MYSQL_PASSWORD,
// });

const insertTransaction = async (transaction) => {
	let {
		id,
		debit,
		credit,
		amount,
		debit_balance,
		credit_balance,
		comment,
	} = transaction;
	await db.query(
		escape`INSERT INTO dingel VALUES(${id}, ${debit}, ${credit}, ${amount}, ${debit_balance}, ${credit_balance}, ${comment})`
	);
	await db.query(
		escape`UPDATE dingel SET debit_balance = debit_balance + ${amount} WHERE id > ${id} AND (debit = ${debit} OR debit = ${credit})`
	);
	await db.query(
		escape`UPDATE dingel SET credit_balance = credit_balance - ${amount} WHERE id > ${id} AND (credit = ${debit} OR credit = ${credit})`
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
		lastId = await db.query(
			`SELECT MAX(id) max_id FROM ${process.env.DB_TABLE}`
		);
	}

	lastId = lastId[0]["max_id"] || date;
	await db.quit();
	return lastId;
};

const getTransactionIdentifiers = async () => {
	const rows = await db.query(`SELECT * FROM transaction_identifiers`);
	await db.quit();

	const identifers = {
		fastFoodLocations: [],
		gasLocations: [],
		groceriesLocations: [],
		rentAmount: null,
		carPaymentAmount: null,
		salaryAmount: null,
	};
	for (let row of rows) {
		if (row.subtype === "fastFood") {
			identifers.fastFoodLocations.push(row.identifier);
		} else if (row.subtype === "gas") {
			identifers.gasLocations.push(row.identifier);
		} else if (row.subtype === "groceries") {
			identifers.groceriesLocations.push(row.identifier);
		} else if (row.subtype === "rent") {
			identifers.rentAmount = row.identifier;
		} else if (row.subtype === "carPayment") {
			identifers.carPaymentAmount = row.identifier;
		} else if (row.subtype === "salary") {
			identifers.salaryAmount = row.identifier;
		}
	}
	return identifers;
};

const getAll = async () => {
	let results = await db.query(escape`SELECT * FROM dingel ORDER BY id desc`);
	await db.quit();
	return results;
};

const getAllAccountBalances = async () => {
	let balances = {};
	let accounts = await db.query(
		escape`SELECT name FROM accounts WHERE closed = false`
	);
	for (let account of accounts) {
		const name = account.name;
		const lastDebit = await db.query(escape`
			SELECT debit_balance FROM dingel where debit=${name} order by id desc limit 1;
		`);
		const lastCredit = await db.query(escape`
	  		SELECT credit_balance FROM dingel where credit=${name} order by id desc limit 1;
		`);
		await db.quit();

		// has the account had *both* debits and credits?
		if (lastDebit.length > 0 && lastCredit.length > 0) {
			// if the most recent debit is more recent than the most recent credit
			if (lastDebit.id > lastCredit.id) {
				balances[name] = lastDebit[0]["debit_balance"];
			} else {
				balances[name] = lastCredit[0]["credit_balance"];
			}
			// has it had any debits?
		} else if (lastDebit.length > 0) {
			balances[name] = lastDebit[0]["debit_balance"];
			// has it had any credits?
		} else if (lastCredit.length > 0) {
			balances[name] = lastCredit[0]["credit_balance"];
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

const getLastAccountBalances = async (debit, credit, id) => {
	let lastAccountBalances = {};
	let debitResults = await db.query(escape`
    	SELECT debit, credit, debit_balance, credit_balance FROM dingel WHERE (debit = ${debit} OR credit = ${debit}) AND (id < ${id}) ORDER BY id desc limit 1
	`);
	let creditResults = await db.query(escape`
		SELECT debit, credit, debit_balance, credit_balance FROM dingel WHERE (debit = ${credit} OR credit = ${credit}) AND (id < ${id}) ORDER BY id desc limit 1
	`);
	if (debitResults.length > 0) {
		if (debitResults[0].debit === debit) {
			lastAccountBalances.debit = debitResults[0].debit_balance;
		} else {
			lastAccountBalances.debit = debitResults[0].credit_balance;
		}
	} else {
		lastAccountBalances.debit = 0;
	}

	if (creditResults.length > 0) {
		if (creditResults[0].debit === credit) {
			lastAccountBalances.credit = creditResults[0].debit_balance;
		} else {
			lastAccountBalances.credit = creditResults[0].credit_balance;
		}
	} else {
		lastAccountBalances.credit = 0;
	}

	await db.quit();
	return lastAccountBalances;
};

const getAccountTransactions = async (account) => {
	let results = await db.query(
		escape`SELECT * FROM dingel WHERE credit=${account} OR debit=${account} ORDER BY id desc`
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
};

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
