import {getAccountPageData} from '../../services/account-page-service';

export default async (req, res) => {
	const account = req.query.account;
	const user = req.query.user;

	const results = await getAccountPageData(account, user);

	res.status(200).json(results);
};
