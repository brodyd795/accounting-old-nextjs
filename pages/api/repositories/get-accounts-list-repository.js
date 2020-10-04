import {withTransactionWrapper, conn} from './transaction-wrapper-repository';

const getAllAccountBalances = async () => {
	return conn.query(`SELECT acc_name FROM accounts WHERE open = true`);
};

export default async () => withTransactionWrapper(getAllAccountBalances);
