import escape from 'sql-template-strings';

import {withTransactionWrapper, conn} from './transaction-wrapper-repository';

export const getUpdatedTransactions = async props => {
	const {id, user} = props;

	try {
		const results = await conn(user).query(
			escape`SELECT * FROM transactions WHERE trn_id >= ${id} ORDER BY trn_id desc`
		);

		return results;
	} catch (error) {
		throw new Error(error);
	}
};

export const wrappedGetUpdatedTransactions = async props =>
	withTransactionWrapper(getUpdatedTransactions, props);
