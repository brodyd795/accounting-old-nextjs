import {getAccountsPageData} from '../../services/accounts-page-service';

export default async (req, res) => {
	const data = await getAccountsPageData();

	res.json(data);
};
