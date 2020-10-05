import {withTransactionWrapper, conn} from './transaction-wrapper-repository';

const getAllAccountBalances = async props => {
	const {user} = props;

	return conn(user).query(`SELECT acc_name FROM accounts WHERE open = true`);
};

export default async props =>
	withTransactionWrapper(getAllAccountBalances, props);
