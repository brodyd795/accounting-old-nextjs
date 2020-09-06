import dotenv from "dotenv";
import mysqlPromise from "mysql2/promise.js";

dotenv.config();

export const createConn = async () => {
	const conn = await mysqlPromise.createConnection({
		host: process.env.DB_HOST,
		database: process.env.DB_NAME,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
	});
	return conn;
};
