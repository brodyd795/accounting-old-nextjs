import mysql from 'serverless-mysql';
import dotenv from 'dotenv';

dotenv.config();

export const conn = mysql({
	config: {
		host: process.env.DB_HOST,
		database:
			process.env.ENVIRONMENT === 'dev'
				? `${process.env.DB_NAME}_TEST`
				: process.env.DB_NAME,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD
	}
});

export const withTransactionWrapper = async (queries, props) => {
	try {
		await conn.query('BEGIN');

		const results = await queries(props);

		await conn.query('COMMIT');

		return results;
	} catch (error) {
		await conn.query('ROLLBACK');

		return new Error(error);
	} finally {
		await conn.end();
	}
};
