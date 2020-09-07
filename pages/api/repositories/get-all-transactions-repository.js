import { createConn } from "./create-connection-repository";

export const getAll = async (isAdmin) => {
	const conn = await createConn();

	try {
		if (isAdmin) {
			await conn.query("START TRANSACTION");
			let results = await conn.query(
				`SELECT * FROM transactions ORDER BY trn_id desc`
			);
			await conn.query("COMMIT");
			return results[0];
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
