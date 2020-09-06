const mysql = require("mysql2/promise");
require("dotenv").config();

export const createConn = async () => {
	const conn = await mysql.createConnection({
		host: process.env.DB_HOST,
		database: process.env.DB_NAME,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
	});
	return conn;
};
