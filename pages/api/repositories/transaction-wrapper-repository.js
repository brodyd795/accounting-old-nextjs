import mysql from 'serverless-mysql';
import dotenv from 'dotenv';

import {isAdmin} from '../services/is-admin-service';

dotenv.config();

let connection,
	isMidTransaction = false;

export const conn = () => {
	if (connection !== undefined) {
		return connection;
	}

	const databaseBaseName = process.env.DB_NAME;

	connection = mysql({
		config: {
			database: process.env.ENVIRONMENT === 'dev' ? `${databaseBaseName}_DEV` : databaseBaseName,
			host: process.env.DB_HOST,
			password: process.env.DB_PASSWORD,
			user: process.env.DB_USER
		}
	});

	return connection;
};

export const withTransactionWrapper = async (queries, props) => {
	if (!isMidTransaction) {
		isMidTransaction = true;

		try {
			await conn().query('BEGIN');

			const results = await queries(props);

			await conn().query('COMMIT');

			return results;
		} catch (error) {
			await conn().query('ROLLBACK');
			console.log('error', error)

			return new Error(error);
		} finally {
			await conn().end();
			isMidTransaction = false;
		}
	}

	return queries(props);
};
