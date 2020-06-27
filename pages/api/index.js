const db = require("./db");

export default async (req, res) => {
	const data = await db.getAllAccountBalances();
	res.json(data);
};
