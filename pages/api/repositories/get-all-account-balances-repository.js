import escape from 'sql-template-strings';

import {withTransactionWrapper, conn} from './transaction-wrapper-repository';

const getAllAccountBalances = async name => {
	const lastDebit = await conn.query(
		escape`SELECT to_balance FROM transactions where to_account = ${name} order by trn_id desc limit 1`
	);
	const lastCredit = await conn.query(
		escape`SELECT from_balance FROM transactions where from_account = ${name} order by trn_id desc limit 1`
	);

	return {
		lastDebit,
		lastCredit
	};
};

export default async props =>
	withTransactionWrapper(getAllAccountBalances, props);
