import {getAccountsPageData} from '../../services/accounts-page-service';

export default async (req, res) => {
	const user = req.query.user;

	const data = await getAccountsPageData(user);

	res.json(data);
};
