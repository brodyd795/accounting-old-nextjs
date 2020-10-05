import getAccountTransactions from '../repositories/get-account-transactions-repository';

export const getAccountPageData = async (account, user) => {
	const results = await getAccountTransactions({account, user});

	if (results.length) {
		const resultsWithoutEmail = results.map(({user_email, ...rest}) => ({
			...rest
		}));

		return {data: resultsWithoutEmail};
	}

	return {message: `Results for account ${account} not found`};
};
