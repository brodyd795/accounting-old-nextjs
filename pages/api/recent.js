const db = require("./db");

export default async (req, res) => {
	let data = await db.getAll();

	res.json(data);
};
