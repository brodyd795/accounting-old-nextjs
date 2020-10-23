import getAccountPageData from '../../services/account-page-service';
import getAccountsPageData from '../../services/accounts-page-service';

export default async (req, res) => {
	const account = req.query.account;
	const user = req.query.user;
	const date = new Date(req.query.date);

	const results = await Promise.all([
		getAccountPageData({
			account,
			user,
			date
		}),
		getAccountsPageData({user})
	]);

	const data = {
		recentTransactions: results[0],
		accounts: results[1]
	};

	res.status(200).json(data);
};
