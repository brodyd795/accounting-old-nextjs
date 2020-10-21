import escape from 'sql-template-strings';

import {conn} from './transaction-wrapper-repository';

export default async props => {
	const {account, user} = props;

	const results = await conn(user).query(
		escape`SELECT * FROM transactions WHERE from_account = ${account} OR to_account = ${account} ORDER BY trn_id desc`
	);

	return results;
};
