const db = require("./db");
import { fetchUser } from "../../lib/user";

export default async (req, res) => {
	let isAdmin = false;
	if (process.env.ADMIN_EMAILS.includes(req.query.user)) {
		isAdmin = true;
	}

	const data = await db.getAll();
	res.json(data);
};
