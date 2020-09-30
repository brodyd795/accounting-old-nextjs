import deleteTransaction from "../repositories/delete-repository";

export const deleteTransactionService = async (rowToDelete) =>
	deleteTransaction(rowToDelete);
