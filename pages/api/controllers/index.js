import getHomepageData from '../services/home-page-service';

export default async (req, res) => {
	const selectedMonthDate = new Date(req.query.date);

	const data = await getHomepageData({selectedMonthDate});

	res.json(data);
};
