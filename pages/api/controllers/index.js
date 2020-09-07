import { getHomepageData } from "../services/home-page-service";

export default async (req, res) => {
	const user = req.query.user;
	const data = await getHomepageData(user);

	res.json(data);
};
