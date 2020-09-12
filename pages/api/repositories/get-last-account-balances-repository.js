import { createConn } from "./create-connection-repository";

export const getLastAccountBalances = async (toAccount, fromAccount, id) => {
	const conn = await createConn();

	try {
		await conn.query("START TRANSACTION");

		let lastAccountBalances = {};
		let toAccountResults = await conn.query(
			"SELECT to_account, from_account, to_balance, from_balance FROM transactions WHERE (to_account = ? OR from_account = ?) AND (trn_id < ?) ORDER BY trn_id desc limit 1",
			[toAccount, toAccount, id]
		);
		let fromAccountResults = await conn.query(
			"SELECT to_account, from_account, to_balance, from_balance FROM transactions WHERE (to_account = ? OR from_account = ?) AND (trn_id < ?) ORDER BY trn_id desc limit 1",
			[fromAccount, fromAccount, id]
		);
		toAccountResults = toAccountResults[0];
		fromAccountResults = fromAccountResults[0];
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
