import getAccountTransactions from '../repositories/get-account-transactions-repository';
import {withTransactionWrapper} from '../repositories/transaction-wrapper-repository';

const getAccountPageData = async ({account, user}) => {
	const results = await getAccountTransactions({account, user});

	if (results.length) {
		const resultsWithoutEmail = results.map(({user_email, ...rest}) => ({
			...rest
		}));

		return resultsWithoutEmail;
	}

	return {message: `Results for account ${account} not found`};
};

export default async props => withTransactionWrapper(getAccountPageData, props);
