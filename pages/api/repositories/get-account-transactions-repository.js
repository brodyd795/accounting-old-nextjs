import escape from 'sql-template-strings';

import {conn} from './transaction-wrapper-repository';

export default async props => {
	const {account, user, dateRange} = props;

	const results = await conn(user).query(
		escape`SELECT * FROM transactions WHERE (from_account = ${account} OR to_account = ${account}) AND trn_id > ${dateRange.min} AND trn_id < ${dateRange.max} ORDER BY trn_id desc`
	);

	return results;
};
