import { transactionCategories } from '../../../enums/transaction-categories';
import {getStartOfSelectedMonth, getStartOfNextMonth} from '../helpers/date-helpers';
import getAllAccountBalances from '../repositories/get-all-account-balances-repository';
import getLastMonthsIncome from '../repositories/get-last-months-income';
import {withTransactionWrapper} from '../repositories/transaction-wrapper-repository';

const getHomepageData = async ({selectedMonthDate}) => {
	// TODO: use selectedMonthDate once I'm done testing
	const testingDate = new Date(2021, 1, 1, 2);

	const lastMonth = getStartOfSelectedMonth(testingDate);
	const thisMonth = getStartOfNextMonth(testingDate);

	const [lastMonthsIncomeRows, balances] = await Promise.all([
		getLastMonthsIncome({lastMonth}),
		getAllAccountBalances({date: thisMonth})
	]);

	const lastMonthsIncomeTotal = lastMonthsIncomeRows.reduce((acc, {balance}) => acc + balance, 0);
	const balancesByCategory = Object.values(transactionCategories).reduce((acc, category) => ({
			...acc, 
			[category]: balances.filter((balance) => balance.category === category)
		}), {}
	);

	return {
		balancesByCategory,
		lastMonthsIncomeTotal
	};
};

export default async props => withTransactionWrapper(getHomepageData, props);
