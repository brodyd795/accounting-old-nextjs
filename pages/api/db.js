const mysqlOLD = require("serverless-mysql");
const mysql = require("mysql2/promise");
const escape = require("sql-template-strings");
require("dotenv").config();

// old;
const db = mysqlOLD({
	config: {
		host: process.env.DB_HOST,
		database: process.env.DB_NAME,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
	},
});

const createConn = async () => {
	const conn = await mysql.createConnection({
		host: process.env.DB_HOST,
		database: process.env.DB_NAME,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
	});
	return conn;
};

const insertTransaction = async (transaction) => {
	const conn = await createConn();

	try {
		const {
			id,
			userEmail,
			toAccount,
			fromAccount,
			amount,
			toBalance,
			fromBalance,
			comment,
		} = transaction;

		await conn.query("START TRANSACTION");
		await conn.query(
			"INSERT INTO transactions VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
			[
				id,
				userEmail,
				fromAccount,
				toAccount,
				amount,
				fromBalance,
				toBalance,
				comment,
			]
		);
		await conn.query(
			"UPDATE transactions SET to_balance = to_balance + ? WHERE trn_id > ? AND (to_account = ? OR to_account = ?)",
			[amount, id, toAccount, fromAccount]
		);
		await conn.query(
			"UPDATE transactions SET from_balance = from_balance - ? WHERE trn_id > ? AND (from_account = ? OR from_account = ?)",
			[amount, id, toAccount, fromAccount]
		);
		await conn.query("COMMIT");
		return "OK";
	} catch (error) {
		console.log("error", error);
		await conn.query("ROLLBACK");
		return "NOT OK";
	} finally {
		await conn.end();
	}
};

const getTransaction = async (id) => {
	const conn = await createConn();

	try {
		await conn.query("START TRANSACTION");
		let results = await conn.query(
			escape`SELECT * FROM first WHERE TransactionId=${id}`
		);
		await conn.query("COMMIT");
		return results;
	} catch (error) {
		console.log("error", error);
		await conn.query("ROLLBACK");
		return "NOT OK";
	} finally {
		await conn.end();
	}
};

/*
 * Gets most recent id from database, either absolutely or for a given date.
 * Returns date if date is provided but not found in database.
 * @param	Int	[date]	Date
 * @return 	Int 		Most recent id
 */
const getLastId = async (date) => {
	const conn = await createConn();
	let lastId;

	try {
		await conn.query("START TRANSACTION");

		if (date) {
			lastId = await db.query(
				escape`SELECT MAX(trn_id) max_id FROM transactions WHERE trn_id BETWEEN ${date} AND ${
					date + 99
				}`
			);
		} else {
			lastId = await db.query(`SELECT MAX(trn_id) max_id FROM transactions`);
		}
		lastId = lastId[0]["max_id"] || date;

		await conn.query("COMMIT");

		return lastId;
	} catch (error) {
		console.log("error", error);
		await conn.query("ROLLBACK");
		return "NOT OK";
	} finally {
		await conn.end();
	}
};

const getTransactionIdentifiers = async () => {
	const conn = await createConn();

	try {
		await conn.query("START TRANSACTION");
		const rows = await conn.query(`SELECT * FROM transaction_identifiers`);

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

		await conn.query("COMMIT");
		return identifiers;
	} catch (error) {
		console.log("error", error);
		await conn.query("ROLLBACK");
		return "NOT OK";
	} finally {
		await conn.end();
	}
};

const getAll = async (isAdmin) => {
	const conn = await createConn();

	try {
		if (isAdmin) {
			await conn.query("START TRANSACTION");
			let results = await conn.query(
				escape`SELECT * FROM transactions ORDER BY trn_id desc`
			);
			await conn.query("COMMIT");
			return results;
		}

		return { message: "error" };
	} catch (error) {
		console.log("error", error);
		await conn.query("ROLLBACK");
		return "NOT OK";
	} finally {
		await conn.end();
	}
};

const getAllAccountBalances = async (isAdmin) => {
	const conn = await createConn();

	try {
		await conn.query("START TRANSACTION");

		let balances = {};
		let accounts = await conn.query(
			escape`SELECT acc_name FROM accounts WHERE open = true`
		);
		for (let account of accounts) {
			const name = account.acc_name;
			const lastDebit = await conn.query(escape`
				SELECT to_balance FROM transactions where to_account=${name} order by trn_id desc limit 1;
			`);
			const lastCredit = await conn.query(escape`
				  SELECT from_balance FROM transactions where from_account=${name} order by trn_id desc limit 1;
			`);

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
		await conn.query("COMMIT");

		return summarizeAllAccountBalances(balances);
	} catch (error) {
		console.log("error", error);
		await conn.query("ROLLBACK");
		return "NOT OK";
	} finally {
		await conn.end();
	}
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
	const conn = await createConn();

	try {
		await conn.query("START TRANSACTION");

		let accounts = await conn.query(
			escape`SELECT acc_name FROM accounts WHERE open = true`
		);

		await conn.query("COMMIT");
		return accounts;
	} catch (error) {
		console.log("error", error);
		await conn.query("ROLLBACK");
		return "NOT OK";
	} finally {
		await conn.end();
	}
};

const getLastAccountBalances = async (toAccount, fromAccount, id) => {
	const conn = await createConn();

	try {
		await conn.query("START TRANSACTION");

		let lastAccountBalances = {};
		let toAccountResults = await conn.query(escape`
    	SELECT to_account, from_account, to_balance, from_balance FROM transactions WHERE (to_account = ${toAccount} OR from_account = ${toAccount}) AND (trn_id < ${id}) ORDER BY trn_id desc limit 1
	`);
		let fromAccountResults = await conn.query(escape`
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

		await conn.query("COMMIT");
		return lastAccountBalances;
	} catch (error) {
		console.log("error", error);
		await conn.query("ROLLBACK");
		return "NOT OK";
	} finally {
		await conn.end();
	}
};

const getAccountTransactions = async (account) => {
	const conn = await createConn();

	try {
		await conn.query("START TRANSACTION");

		let results = await conn.query(
			escape`SELECT * FROM transactions WHERE from_account=${account} OR to_account=${account} ORDER BY trn_id desc`
		);

		await conn.query("COMMIT");
		return results;
	} catch (error) {
		console.log("error", error);
		await conn.query("ROLLBACK");
		return "NOT OK";
	} finally {
		await conn.end();
	}
};

const search = async (params) => {
	const conn = await createConn();

	try {
		await conn.query("START TRANSACTION");

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

		let results = await conn.query("SELECT * FROM first WHERE " + query);

		await conn.query("COMMIT");
		return results;
	} catch (error) {
		console.log("error", error);
		await conn.query("ROLLBACK");
		return "NOT OK";
	} finally {
		await conn.end();
	}
};

const deleteTransaction = async (row) => {
	const conn = await createConn();

	try {
		await conn.query("START TRANSACTION");

		const { trn_id, amount, from_account, to_account } = row;
		await db.query(`delete from transactions where trn_id = ?`, [trn_id]);
		await conn.query(
			"UPDATE transactions SET to_balance = to_balance - ? WHERE trn_id > ? AND (to_account = ? OR to_account = ?)",
			[amount, trn_id, to_account, from_account]
		);
		await conn.query(
			`UPDATE transactions SET from_balance = from_balance + ? WHERE trn_id > ? AND (from_account = ? OR from_account = ?)`,
			[amount, trn_id, to_account, from_account]
		);
		await conn.query("COMMIT");
		return "OK";
	} catch (error) {
		console.log("error", error);
		await conn.query("ROLLBACK");
		return "NOT OK";
	} finally {
		await conn.end();
	}
};

const editTransaction = async (originalRow, editedRow) => {
	const conn = await createConn();

	try {
		await conn.query("START TRANSACTION");
		await deleteTransaction(originalRow);

		const lastBalances = await getLastAccountBalances(
			originalRow.to_account,
			originalRow.from_account,
			originalRow.trn_id
		);

		let amount = parseFloat(editedRow.amount);
		let toBalance = lastBalances.toAccount + amount;
		let fromBalance = lastBalances.fromAccount - amount;

		let id = parseInt(
			// TODO: uncomment once UI has date format like it used to - 2020-08-29
			// editedRow.trn_id.toString().replace(/-/g, "").concat("00")
			editedRow.trn_id.toString()
		);

		if (id / 100 !== parseInt(originalRow.trn_id / 100)) {
			id = await getLastId(id);
		} else {
			id = originalRow.trn_id;
		}
		const result = await insertTransaction({
			id,
			userEmail: "brodydingel@gmail.com",
			toAccount: editedRow.to_account,
			fromAccount: editedRow.from_account,
			amount,
			toBalance,
			fromBalance,
			comment: editedRow.comment,
		});

		return "OK";
	} catch (error) {
		console.log("error", error);
		await conn.query("ROLLBACK");
		return "NOT OK";
	} finally {
		await conn.end();
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
	editTransaction: editTransaction,
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
