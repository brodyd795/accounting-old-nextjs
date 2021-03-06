import escape from 'sql-template-strings';

import {conn} from './transaction-wrapper-repository';

export default async ({date}) =>
	conn().query(escape`
		SELECT
			balances.balance, accounts.accountName, accounts.category, accounts.accountId
		FROM
			balances
		INNER JOIN
			accounts
		ON
			balances.accountId = accounts.accountId
		WHERE
			balances.date = ${date}
	`);
