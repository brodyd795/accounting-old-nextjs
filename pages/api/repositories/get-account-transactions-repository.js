import { createConn } from "./create-connection-repository";

export const getAccountTransactions = async (account) => {
	const conn = await createConn();

	try {
		await conn.query("START TRANSACTION");

		const results = await conn.query(
			`SELECT * FROM transactions WHERE from_account= ? OR to_account= ? ORDER BY trn_id desc`,
			[account, account]
		);

		await conn.query("COMMIT");
		return results[0];
	} catch (error) {
		console.log("error", error);
		await conn.query("ROLLBACK");
		return "NOT OK";
	} finally {
		await conn.end();
	}
};
