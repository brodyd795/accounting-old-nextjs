import {wrappedDeleteTransaction} from '../repositories/delete-repository';

export const deleteTransactionService = async rowToDelete =>
	wrappedDeleteTransaction(rowToDelete);
