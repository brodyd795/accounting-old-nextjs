import { deleteTransaction } from "../repositories/delete-repository";

export const deleteTransactionService = async (rowToDelete) => {
	const results = await deleteTransaction(rowToDelete);
	return results;
};
