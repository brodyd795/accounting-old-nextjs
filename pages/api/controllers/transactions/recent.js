import {getAccountsPageData} from '../../services/accounts-page-service';
import {getRecentPageData} from '../../services/recent-page-service';

export default async (req, res) => {
	const user = req.query.user;

	const results = await Promise.all([
		getRecentPageData(user),
		getAccountsPageData(user)
	]);
	const data = {
		recentTransactions: results[0],
		accounts: results[1]
	};

	res.json(data);
};
