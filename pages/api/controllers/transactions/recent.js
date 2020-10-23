import getAccountsPageData from '../../services/accounts-page-service';
import getRecentPageData from '../../services/recent-page-service';

export default async (req, res) => {
	const user = req.query.user;
	const date = new Date(req.query.date);

	const results = await Promise.all([
		getRecentPageData({user, date}),
		getAccountsPageData({user})
	]);
	const data = {
		recentTransactions: results[0],
		accounts: results[1]
	};

	res.status(200).json(data);
};
