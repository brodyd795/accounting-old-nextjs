import {withTransactionWrapper} from '../repositories/transaction-wrapper-repository';
import updateTransaction from '../repositories/update-transaction-repository';

const editTransaction = async props =>
	updateTransaction({
		...props,
		date: props.date.slice(0, 10)
	});

export default async props => withTransactionWrapper(editTransaction, props);
