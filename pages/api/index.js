const db = require("./db");

export default async (req, res) => {
	const data = await db.getAllAccountBalances();
	// console.log(JSON.stringify(data));
	res.json(data);
};
