import { createConn } from "./create-connection-repository";

export const insertTransaction = async (transaction) => {
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
