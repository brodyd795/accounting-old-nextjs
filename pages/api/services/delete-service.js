import deleteTransaction from '../repositories/delete-repository';
import {withTransactionWrapper} from '../repositories/transaction-wrapper-repository';

const deleteTransactionService = async props => deleteTransaction(props);

export default async props =>
	withTransactionWrapper(deleteTransactionService, props);
