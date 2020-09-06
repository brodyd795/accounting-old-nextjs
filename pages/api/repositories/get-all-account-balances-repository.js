import { createConn } from "./create-connection-repository";

export const getAllAccountBalances = async (isAdmin) => {
	const conn = await createConn();

	try {
		await conn.query("START TRANSACTION");

		let balances = {};
		let accounts = await conn.query(
			`SELECT acc_name FROM accounts WHERE open = true`
		);
		for (let account of accounts[0]) {
			const name = account.acc_name;
			let lastDebit = await conn.query(
				`SELECT to_balance FROM transactions where to_account = ? order by trn_id desc limit 1`,
				[name]
			);
			let lastCredit = await conn.query(
				`SELECT from_balance FROM transactions where from_account = ? order by trn_id desc limit 1`,
				[name]
			);
			lastDebit = lastDebit[0];
			lastCredit = lastCredit[0];

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
			Object.values(accounts).reduce(
				(acc, balance) => acc + parseFloat(balance),
				0
			)
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
