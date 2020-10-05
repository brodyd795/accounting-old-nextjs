import {wrappedDeleteTransaction} from '../repositories/delete-repository';

export const deleteTransactionService = async (rowToDelete, user) =>
	wrappedDeleteTransaction({rowToDelete, user});
