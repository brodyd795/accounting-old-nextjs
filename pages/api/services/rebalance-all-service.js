import {withTransactionWrapper} from '../repositories/transaction-wrapper-repository';
import {
	deleteAllBalances,
	reinsertAllBalancesNew,
	selectAllTransactions
} from '../repositories/rebalance-repository';
import {calculateNewBalances, formatBalancesForDb, getCurrentAccountBalance, getPreviousBalanceDate, reduceBalancesToString} from '../helpers/balance-helpers';
import {getAccountsList} from '../repositories/get-accounts-list-repository';

const rebalanceAll = async () => {
	const [transactions, accounts, _] = await Promise.all([
		selectAllTransactions(),
		getAccountsList(),
		deleteAllBalances()
	]);

	const balances = calculateNewBalances(transactions, accounts);
	const balancesToInsert = formatBalancesForDb(balances);
	const valuesString = reduceBalancesToString(balancesToInsert);

    await reinsertAllBalancesNew(valuesString);
};

export const rebalanceAllService = async (props) => withTransactionWrapper(rebalanceAll, props);
