import { createConn } from "./create-connection-repository";

export const deleteTransaction = async (row) => {
	const conn = await createConn();

	try {
		await conn.query("START TRANSACTION");

		const { trn_id, amount, from_account, to_account } = row;
		await conn.query(`delete from transactions where trn_id = ?`, [trn_id]);
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
