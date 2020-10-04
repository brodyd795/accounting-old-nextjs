import escape from 'sql-template-strings';

import {withTransactionWrapper, conn} from './transaction-wrapper-repository';

const getAllAccountBalances = async account => {
	const results = await conn.query(
		escape`SELECT * FROM transactions WHERE from_account = ${account} OR to_account = ${account} ORDER BY trn_id desc`
	);

	return results;
};

export default async props =>
	withTransactionWrapper(getAllAccountBalances, props);
