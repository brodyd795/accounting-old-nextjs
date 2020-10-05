import {withTransactionWrapper, conn} from './transaction-wrapper-repository';

const getAllAccountBalances = async props => {
	const {user} = props;

	return conn(user).query(`SELECT * FROM transactions ORDER BY trn_id desc`);
};

export const wrappedGetAllAccountBalances = async props =>
	withTransactionWrapper(getAllAccountBalances, props);
