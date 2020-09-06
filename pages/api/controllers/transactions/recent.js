const db = require("../../db");

export default async (req, res) => {
	let isAdmin = false;
	if (process.env.ADMIN_EMAILS.includes(req.query.user)) {
		isAdmin = true;
	}

	let data = await db.getAll(isAdmin);
	data = data.map(({ user_email, ...rest }) => ({ ...rest }));

	res.json(data);
};
