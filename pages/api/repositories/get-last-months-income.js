import escape from 'sql-template-strings';

import {conn} from './transaction-wrapper-repository';

export default async props => {
	const {lastMonth, user} = props;

	const lastPossibleId = `${lastMonth}9999`;

	const lastIncomeRow = await conn(user).query(
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
				balances.date = '2021-03-01'
			AND
				accounts.category = 'Income'
			
			`
	);
	console.log('lastIncomeRow', lastIncomeRow);

	return lastIncomeRow;
};
