import { getAccountPageData } from "../../services/account-page-service";

export default async (req, res) => {
	const account = req.query.account;
	const results = await getAccountPageData(account);

	res.status(200).json(results);
};
