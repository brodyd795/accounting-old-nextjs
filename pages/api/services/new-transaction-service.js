import getLastAccountBalancesService from './last-account-balances-service';

import {withTransactionWrapper} from '../repositories/transaction-wrapper-repository';
import insertTransaction from '../repositories/insert-repository';

const editTransaction = async props => {
	const {newTransaction, user} = props;
	const {toAccount, fromAccount, id, comment, amount} = newTransaction;

	const trn_id = `${id}00`;

	const lastBalances = await getLastAccountBalancesService({
		toAccount,
		fromAccount,
		id: trn_id,
		user
	});

	const toBalance = lastBalances.toAccount + amount;
	const fromBalance = lastBalances.fromAccount - amount;

	const transactionToInsert = {
		id: trn_id,
		userEmail: 'brodydingel@gmail.com',
		toAccount,
		fromAccount,
		amount,
		toBalance,
		fromBalance,
		comment
	};

	await insertTransaction({
		transaction: transactionToInsert,
		user
	});

	return;
};

export default async props => withTransactionWrapper(editTransaction, props);
