import { createConn } from "./create-connection-repository";

export const getAccountsList = async () => {
	const conn = await createConn();

	try {
		await conn.query("START TRANSACTION");

		let accounts = await conn.query(
			`SELECT acc_name FROM accounts WHERE open = true`
		);
		console.log("accounts", accounts);

		await conn.query("COMMIT");
		return accounts[0];
	} catch (error) {
		console.log("error", error);
		await conn.query("ROLLBACK");
		return "NOT OK";
	} finally {
		await conn.end();
	}
};
