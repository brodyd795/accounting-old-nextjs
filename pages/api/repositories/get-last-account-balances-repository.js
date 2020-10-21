import escape from 'sql-template-strings';

import {conn} from './transaction-wrapper-repository';

export default async props => {
	const {toAccount, fromAccount, id, user} = props;
	const toAccountResults = await conn(user).query(
		escape`SELECT to_account, from_account, to_balance, from_balance FROM transactions WHERE (to_account = ${toAccount} OR from_account = ${toAccount}) AND (trn_id < ${id}) ORDER BY trn_id desc limit 1`
	);
	const fromAccountResults = await conn(user).query(
		escape`SELECT to_account, from_account, to_balance, from_balance FROM transactions WHERE (to_account = ${fromAccount} OR from_account = ${fromAccount}) AND (trn_id < ${id}) ORDER BY trn_id desc limit 1`
	);

	return {
		toAccountResults,
		fromAccountResults
	};
};
