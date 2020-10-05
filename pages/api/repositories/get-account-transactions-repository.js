import escape from 'sql-template-strings';

import {withTransactionWrapper, conn} from './transaction-wrapper-repository';

const getAllAccountBalances = async props => {
	const {account, user} = props;

	const results = await conn(user).query(
		escape`SELECT * FROM transactions WHERE from_account = ${account} OR to_account = ${account} ORDER BY trn_id desc`
	);

	return results;
};

export default async props =>
	withTransactionWrapper(getAllAccountBalances, props);
