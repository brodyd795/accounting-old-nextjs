import escape from 'sql-template-strings';

import {conn} from './transaction-wrapper-repository';

export default async props => {
	const {user, name} = props;

	const lastDebit = await conn(user).query(
		escape`SELECT to_balance FROM transactions where to_account = ${name} order by trn_id desc limit 1`
	);
	const lastCredit = await conn(user).query(
		escape`SELECT from_balance FROM transactions where from_account = ${name} order by trn_id desc limit 1`
	);

	return {
		lastDebit,
		lastCredit
	};
};
