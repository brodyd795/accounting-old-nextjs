import {withTransactionWrapper, conn} from './transaction-wrapper-repository';

const getAllAccountBalances = async () => {
	return conn.query(`SELECT * FROM transactions ORDER BY trn_id desc`);
};

export default async props =>
	withTransactionWrapper(getAllAccountBalances, props);
