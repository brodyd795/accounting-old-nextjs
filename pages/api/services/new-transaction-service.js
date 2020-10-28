import getLastAccountBalancesService from './last-account-balances-service';

import {withTransactionWrapper} from '../repositories/transaction-wrapper-repository';
import insertTransaction from '../repositories/insert-repository';
import getLastId from '../repositories/get-last-id-repository';

const editTransaction = async props => {
	const {newTransaction, user} = props;
	const {toAccount, fromAccount, id, comment, amount} = newTransaction;

	const newId = await getLastId({
		date: `${id}00`,
		user
	})

	const lastBalances = await getLastAccountBalancesService({
		toAccount,
		fromAccount,
		id: newId,
		user
	});
	console.log('lastBalances', lastBalances)

	const toBalance = lastBalances.toAccount + amount;
	const fromBalance = lastBalances.fromAccount - amount;

	const transactionToInsert = {
		id: newId,
		userEmail: 'brodydingel@gmail.com',
		toAccount,
		fromAccount,
		amount,
		toBalance,
		fromBalance,
		comment
	};
	console.log('transactionToInsert', transactionToInsert)

	await insertTransaction({
		transaction: transactionToInsert,
		user
	});

	return;
};

export default async props => withTransactionWrapper(editTransaction, props);
