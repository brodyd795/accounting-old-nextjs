import mysql from 'serverless-mysql';
import dotenv from 'dotenv';

dotenv.config();

let connection,
	isMidTransaction = false;

export const conn = user => {
	if (connection !== undefined) {
		return connection;
	}

	let database = process.env.ADMIN_EMAILS.split(' ').includes(user)
		? process.env.DB_NAME
		: `${process.env.DB_NAME}_DEMO`;

	database = process.env.ENVIRONMENT === 'dev' ? `${database}_TEST` : database;

	connection = mysql({
		config: {
			host: process.env.DB_HOST,
			database: database,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD
		}
	});

	return connection;
};

export const withTransactionWrapper = async (queries, props) => {
	if (!isMidTransaction) {
		isMidTransaction = true;

		const {user} = props;

		try {
			await conn(user).query('BEGIN');

			const results = await queries(props);

			await conn(user).query('COMMIT');

			return results;
		} catch (error) {
			await conn(user).query('ROLLBACK');

			return new Error(error);
		} finally {
			await conn(user).end();
			isMidTransaction = false;
		}
	}

	return queries(props);
};
