import {withTransactionWrapper} from '../repositories/transaction-wrapper-repository';
import updateTransaction from '../repositories/update-transaction-repository';

const editTransaction = async props =>
	updateTransaction(props);

export default async props => withTransactionWrapper(editTransaction, props);
