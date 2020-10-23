import {getDateRange} from '../helpers/get-date-range';
import getAccountTransactions from '../repositories/get-account-transactions-repository';
import {withTransactionWrapper} from '../repositories/transaction-wrapper-repository';

const getAccountPageData = async ({account, user, date}) => {
	const dateRange = getDateRange(date);

	const results = await getAccountTransactions({account, user, dateRange});

	if (results.length) {
		const resultsWithoutEmail = results.map(({user_email, ...rest}) => ({
			...rest
		}));

		return resultsWithoutEmail;
	}

	return {message: `Results for account ${account} not found`};
};

export default async props => withTransactionWrapper(getAccountPageData, props);
