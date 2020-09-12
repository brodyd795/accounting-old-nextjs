import { editTransaction } from "../repositories/edit-repository";

export const editTransactionService = async (originalRow, editedRow) => {
	const results = await editTransaction(originalRow, editedRow);
	return results;
};
