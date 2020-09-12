import { createConn } from "./create-connection-repository";

export const getLastId = async (date) => {
	const conn = await createConn();
	let lastId;

	try {
		await conn.query("START TRANSACTION");

		if (date) {
			lastId = await conn.query(
				`SELECT MAX(trn_id) max_id FROM transactions WHERE trn_id BETWEEN ? AND ?`,
				[date, date + 99]
			);
		} else {
			lastId = await conn.query(`SELECT MAX(trn_id) max_id FROM transactions`);
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
