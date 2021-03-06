import {conn} from './transaction-wrapper-repository';

export default async () =>
	conn().query(`
		SELECT
			accountName
		FROM
			accounts
		WHERE
			isOpen = true
		
	`);
