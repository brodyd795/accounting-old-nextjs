import { createConn } from "./create-connection-repository";

export const transactionWrapper = (wrapped) => {
	return async function () {
		console.log("Starting");
		const conn = await createConn();
		let result;
		try {
			await conn.query("START TRANSACTION");
			result = await wrapped.apply(this, arguments);
		} catch (error) {
			await conn.query("ROLLBACK");
			result = error;
		} finally {
			await conn.end();
			console.log("Finished");
			return result === undefined ? "OK" : result;
		}
	};
};
