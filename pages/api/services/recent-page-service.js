import {getDateRange} from '../helpers/date-helpers';
import wrappedGetAllAccountBalances from '../repositories/get-all-transactions-repository';
import {withTransactionWrapper} from '../repositories/transaction-wrapper-repository';

const getRecentPageData = async ({user, date}) => {
	const dateRange = getDateRange(date);

	const data = await wrappedGetAllAccountBalances({user, dateRange});

	const dataWithoutEmail = data.map(({user_email, ...rest}) => ({...rest}));

	return dataWithoutEmail;
};

export default async props => {
	return withTransactionWrapper(getRecentPageData, props);
};
