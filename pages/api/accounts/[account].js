const db = require("../db");

export default async (req, res) => {
	const account = req.query.account;
	let results = await db.getAccountTransactions(account);

	if (results.length > 0) {
		results.map(({ user_email, ...rest }) => ({ ...rest }));
		res.status(200).json({ data: results });
	} else {
		res.json({ message: `Results for account ${account} not found` });
	}
};
