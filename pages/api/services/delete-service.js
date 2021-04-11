import rebalance from './rebalance-service';

import deleteTransaction from '../repositories/delete-repository';
import {withTransactionWrapper} from '../repositories/transaction-wrapper-repository';
import {formatDateForDb} from '../../../lib/date-helpers';

const deleteTransactionService = async props => {
	const formattedDate = formatDateForDb(props.date);
	await deleteTransaction({
		transactionId: props.transactionId,
		date: formattedDate
	});
	console.log('made it past deleting')
	await rebalance({
		date: new Date(props.date)
	});
	console.log('made it past rebalancing')
};

export default async props =>
	withTransactionWrapper(deleteTransactionService, props);
