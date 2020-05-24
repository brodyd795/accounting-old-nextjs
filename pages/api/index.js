const db = require("./db");
const escape = require("sql-template-strings");

export default async (req, res) => {
	let data = await db.getAll();
	data = data[0];

	res.json(data);
};
