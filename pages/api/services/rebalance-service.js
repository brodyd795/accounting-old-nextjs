import {
	selectAll,
	createTempTable,
	renameTablesAndDropOldTable,
	insertTransaction
} from '../repositories/rebalance-repository';
import {withTransactionWrapper} from '../repositories/transaction-wrapper-repository';
import getLastAccountBalancesService from './last-account-balances-service';

const rebalanceService = async props => {
	const {user} = props;

	const allTransactions = await selectAll(props);

	await createTempTable({user});

	await processTransactions(allTransactions, user);

	await renameTablesAndDropOldTable({user});

	return;
};

const processTransactions = async (allTransactions, user) => {
	for (let transaction of allTransactions) {
		await processTransaction(transaction, user);
	}
};

const processTransaction = async (transaction, user) => {
	console.log('transaction', transaction);
	const lastBalances = await getLastAccountBalancesService({
		toAccount: transaction.to_account,
		fromAccount: transaction.from_account,
		id: transaction.trn_id,
		user
	});
	const toBalance = lastBalances.toAccount + transaction.amount;
	const fromBalance = lastBalances.fromAccount - transaction.amount;

	const newTransaction = {
		id: transaction.trn_id,
		userEmail: 'brodydingel@gmail.com',
		toAccount: transaction.to_account,
		fromAccount: transaction.from_account,
		amount: transaction.amount,
		toBalance,
		fromBalance,
		comment: transaction.comment
	};
	console.log('newTransaction', newTransaction);
	await insertTransaction({
		transaction: newTransaction,
		user
	});
};

export default async props => withTransactionWrapper(rebalanceService, props);
