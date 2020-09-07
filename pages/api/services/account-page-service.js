import { getAccountTransactions } from "../repositories/get-account-transactions-repository";

export const getAccountPageData = async (account) => {
	const results = await getAccountTransactions(account);

	if (results.length > 0) {
		const resultsWithoutEmail = results.map(({ user_email, ...rest }) => ({
			...rest,
		}));
		return { data: resultsWithoutEmail };
	} else {
		return { message: `Results for account ${account} not found` };
	}
};
