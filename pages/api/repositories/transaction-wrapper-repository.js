import mysql from "serverless-mysql";
import dotenv from "dotenv";

dotenv.config();

export const conn = mysql({
	config: {
		host: process.env.DB_HOST,
		database: process.env.DB_NAME,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
	},
});

export const withTransactionWrapper = async (queries, props) => {
	try {
		await conn.query("BEGIN");

		const results = await queries(props);

		await conn.query("COMMIT");
		return results;
	} catch (err) {
		console.log("err.message", err.message);
		await conn.query("ROLLBACK");
		return "Error!";
	} finally {
		await conn.end();
	}
};
