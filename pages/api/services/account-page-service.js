import getAccountTransactions from "../repositories/get-account-transactions-repository";

export const getAccountPageData = async (account) => {
	const results = await getAccountTransactions(account);

	if (results.length) {
		const resultsWithoutEmail = results.map(({ user_email, ...rest }) => ({
			...rest,
		}));

		return { data: resultsWithoutEmail };
	}

	return { message: `Results for account ${account} not found` };
};
