import escape from 'sql-template-strings';

import {conn} from './transaction-wrapper-repository';

export default async props => {
	const {user, name, dateRange} = props;

	const lastDebit = await conn(user).query(
		escape`SELECT to_balance FROM transactions WHERE to_account = ${name} AND trn_id > ${dateRange.min} AND trn_id < ${dateRange.max} order by trn_id desc limit 1`
	);
	const lastCredit = await conn(user).query(
		escape`SELECT from_balance FROM transactions WHERE from_account = ${name} AND trn_id > ${dateRange.min} AND trn_id < ${dateRange.max} order by trn_id desc limit 1`
	);

	return {
		lastDebit,
		lastCredit
	};
};
