import { withTransactionWrapper } from "../repositories/transaction-wrapper-repository";

import { deleteTransaction } from "../repositories/delete-repository";
import { getLastAccountBalancesService } from "./last-account-balances-service";
import { insertTransaction } from "../repositories/insert-repository";
import { getLastId } from "../repositories/get-last-id-repository";

export const editTransactionService = async (props) => {
	try {
		const { originalRow, editedRow } = props;

		const deleteResult = await deleteTransaction(originalRow);

		const lastBalances = await getLastAccountBalancesService(
			originalRow.to_account,
			originalRow.from_account,
			originalRow.trn_id
		);

		const amount = parseFloat(editedRow.amount);
		const toBalance = parseFloat(lastBalances.toAccount) + parseFloat(amount);
		const fromBalance =
			parseFloat(lastBalances.fromAccount) - parseFloat(amount);

		// TODO: uncomment once UI has date format like it used to - 2020-08-29
		// let id = parseInt(
		// editedRow.trn_id.toString().replace(/-/g, "").concat("00")
		// editedRow.trn_id.toString()
		// );

		let id;
		// if (id / 100 !== parseInt(originalRow.trn_id / 100)) {
		if (editedRow.trn_id !== originalRow.trn_id) {
			id = await getLastId(id);
		} else {
			id = originalRow.trn_id;
		}

		const insertResult = await insertTransaction({
			id,
			userEmail: "brodydingel@gmail.com",
			toAccount: editedRow.to_account,
			fromAccount: editedRow.from_account,
			amount,
			toBalance,
			fromBalance,
			comment: editedRow.comment,
		});
		return "OK";
	} catch (e) {
		throw new Error("Error in edit-service.js");
	}
};

export const wrappedEditTransaction = async (props) =>
	withTransactionWrapper(editTransactionService, props);
