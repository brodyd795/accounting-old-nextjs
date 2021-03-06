import {conn} from './transaction-wrapper-repository';

export const getAccountsList = async () =>
	conn().query(`
		SELECT
			accountId, category, accountName
		FROM
			accounts
		WHERE
			isOpen = true
	`);
