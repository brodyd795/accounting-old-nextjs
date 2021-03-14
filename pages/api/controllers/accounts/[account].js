import getAccountPageData from '../../services/account-page-service';
import getAccountsPageData from '../../services/accounts-page-service';

export default async (req, res) => {
	const account = req.query.account;
	const date = new Date(req.query.date);

	const [recentTransactions, accounts] = await Promise.all([
		getAccountPageData({
			account,
			date
		}),
		getAccountsPageData()
	]);

	res.status(200).json({
		recentTransactions,
		accounts
	});
};
