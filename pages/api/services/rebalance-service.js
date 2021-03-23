import {withTransactionWrapper} from '../repositories/transaction-wrapper-repository';
import {deleteAllBalances, reinsertAllBalancesNew, selectAllTransactions} from '../repositories/rebalance-repository';
import {formatBalanceDate} from '../helpers/date-helpers';
import {formatBalancesForDb, getCurrentAccountBalance, getPreviousBalanceDate, reduceBalancesToString} from '../helpers/balance-helpers';

const rebalanceService = async props => {
	await deleteAllBalances();

	const transactions = await selectAllTransactions();

	let balances = {};
	let previousBalanceDate, currentBalanceDate;

	transactions.forEach((transaction) => {
		const {date, fromAccountId, toAccountId, amount} = transaction;

        currentBalanceDate = formatBalanceDate(date);
		previousBalanceDate = getPreviousBalanceDate(currentBalanceDate, previousBalanceDate);

		const fromBalance = getCurrentAccountBalance(fromAccountId, balances, currentBalanceDate, previousBalanceDate) - amount;
        const toBalance = getCurrentAccountBalance(toAccountId, balances, currentBalanceDate, previousBalanceDate) + amount;

        balances = {
            ...balances,
            [fromAccountId]: {
                ...balances[fromAccountId],
                [currentBalanceDate]: fromBalance
            },
            [toAccountId]: {
                ...balances[toAccountId],
                [currentBalanceDate]: toBalance
            }
        };
	});

	const balancesToInsert = formatBalancesForDb(balances);
	const valuesString = reduceBalancesToString(balancesToInsert);

    await reinsertAllBalancesNew(valuesString);
};

export default async props => withTransactionWrapper(rebalanceService, props);
