import getHomepageData from '../services/home-page-service';

export default async (req, res) => {
	const user = req.query.user;
	const date = new Date(req.query.date);

	const data = await getHomepageData({user, date});

	res.json(data);
};
