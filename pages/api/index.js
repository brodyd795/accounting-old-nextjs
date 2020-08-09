const db = require("./db");
import { fetchUser } from "../../lib/user";

export default async (req, res) => {
	fetchUser().then((user) => console.log("user", user));
	const userEmail = req.url.replace(/\/api\?user=(.+)$/, "$1");
	const data = await db.getAllAccountBalances(userEmail);
	res.json(data);
};
