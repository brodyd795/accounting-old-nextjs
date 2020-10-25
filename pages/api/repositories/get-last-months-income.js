import escape from 'sql-template-strings';

import {conn} from './transaction-wrapper-repository';

export default async props => {
	const {lastMonth, user} = props;

	const lastPossibleId = `${lastMonth}9999`;

	const lastIncomeRow = await conn(user).query(
		escape`SELECT to_account, from_account, to_balance, from_balance FROM transactions WHERE (to_account LIKE 'I_%' OR from_account LIKE 'I_%') AND (trn_id < ${lastPossibleId}) ORDER BY trn_id desc limit 1`
	);

	return lastIncomeRow;
};
