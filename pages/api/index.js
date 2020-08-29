const db = require("./db");

export default async (req, res) => {
	let isAdmin = false;
	if (process.env.ADMIN_EMAILS.includes(req.query.user)) {
		isAdmin = true;
	}

	const data = await db.getAllAccountBalances(isAdmin);
	res.json(data);
};
