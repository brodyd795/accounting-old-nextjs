import {withTransactionWrapper} from '../repositories/transaction-wrapper-repository';
import {deleteTransaction} from '../repositories/delete-repository';
import {insertTransaction} from '../repositories/insert-repository';
import {getLastId} from '../repositories/get-last-id-repository';

import {getLastAccountBalancesService} from './last-account-balances-service';
import {getUpdatedTransactions} from '../repositories/get-updated-transactions-repository';

export const editTransactionService = async props => {
	try {
		const {originalRow, editedRow, user} = props;

		await deleteTransaction({rowToDelete: originalRow, user});

		const lastBalances = await getLastAccountBalancesService({
			toAccount: originalRow.to_account,
			fromAccount: originalRow.from_account,
			id: originalRow.trn_id,
			user
		});

		const amount = editedRow.amount;
		const toBalance = lastBalances.toAccount + amount;
		const fromBalance = lastBalances.fromAccount - amount;

		/*
		 * TODO: uncomment once UI has date format like it used to - 2020-08-29
		 * let id = parseInt(
		 * editedRow.trn_id.toString().replace(/-/g, "").concat("00")
		 * editedRow.trn_id.toString()
		 * );
		 */

		let id;

		// if (id / 100 !== parseInt(originalRow.trn_id / 100)) {
		if (editedRow.trn_id !== originalRow.trn_id) {
			id = await getLastId({id, user});
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

		const results = await getUpdatedTransactions({
			id,
			user
		});

		return results;
	} catch (error) {
		throw new Error('Error in edit-service.js');
	}
};

export const wrappedEditTransaction = async props =>
	withTransactionWrapper(editTransactionService, props);
