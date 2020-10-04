import {getRecentPageData} from '../../services/recent-page-service';

export default async (req, res) => {
	const user = req.query.user;

	const data = await getRecentPageData(user);

	res.json(data);
};
