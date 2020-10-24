import {withTransactionWrapper} from '../repositories/transaction-wrapper-repository';
import deleteTransaction from '../repositories/delete-repository';
import insertTransaction from '../repositories/insert-repository';
import getLastId from '../repositories/get-last-id-repository';

import getLastAccountBalancesService from './last-account-balances-service';
import getRecentTransactions from './recent-page-service';
import getAccountTransactions from './account-page-service';
import {trnIdToNewDate} from '../helpers/date-helpers';

const editTransaction = async props => {
	const {originalRow, editedRow, user, pageDetails} = props;

	await deleteTransaction({
		rowToDelete: originalRow,
		user
	});

	const lastBalances = await getLastAccountBalancesService({
		toAccount: originalRow.to_account,
		fromAccount: originalRow.from_account,
		id: originalRow.trn_id,
		user
	});

	const amount = editedRow.amount;
	const toBalance = lastBalances.toAccount + amount;
	const fromBalance = lastBalances.fromAccount - amount;

	let id;

	const editedDate = editedRow.trn_id.slice(0, 8);
	const originalDate = originalRow.trn_id.toString().slice(0, 8);

	if (editedDate !== originalDate) {
		id = await getLastId({
			date: `${editedDate}00`,
			user
		});
	} else {
		id = originalRow.trn_id;
	}

	await insertTransaction({
		transaction: {
			id,
			userEmail: 'brodydingel@gmail.com',
			toAccount: editedRow.to_account,
			fromAccount: editedRow.from_account,
			amount,
			toBalance,
			fromBalance,
			comment: editedRow.comment
		},
		user
	});

	switch (pageDetails.type) {
		case 'recent':
			const date = trnIdToNewDate(id);

			return getRecentTransactions({user, date});
		case 'account':
			return getAccountTransactions({
				account: pageDetails.account,
				user,
				date: id
			});
	}

	return;
};

export default async props => withTransactionWrapper(editTransaction, props);
