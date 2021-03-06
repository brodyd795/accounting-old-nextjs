import escape from 'sql-template-strings';

import {conn} from './transaction-wrapper-repository';

export default async ({lastMonth}) =>
	conn().query(
		escape`
			SELECT
				balance
			FROM
				balances
			INNER JOIN
				accounts
			ON
				balances.accountId = accounts.accountId
			WHERE
				balances.date = ${lastMonth}
			AND
				accounts.category = 'Income'
		`);
