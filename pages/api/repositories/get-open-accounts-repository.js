import {withTransactionWrapper, conn} from './transaction-wrapper-repository';

const getOpenAccounts = async () => {
	return conn.query(`SELECT acc_name FROM accounts WHERE open = true`);
};

export default async () => withTransactionWrapper(getOpenAccounts);
