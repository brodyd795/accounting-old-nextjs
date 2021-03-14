import {getDateRange} from '../helpers/date-helpers';
import getAccountTransactions from '../repositories/get-account-transactions-repository';
import {withTransactionWrapper} from '../repositories/transaction-wrapper-repository';

const getAccountPageData = async ({account, date}) => {
	const dateRange = getDateRange(date);
	const results = await getAccountTransactions({account, dateRange});

	return results.length ? results : {message: `No results found for account ${account}`};
};

export default async props => withTransactionWrapper(getAccountPageData, props);
