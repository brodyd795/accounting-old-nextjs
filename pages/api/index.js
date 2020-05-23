const db = require("./db");
const escape = require("sql-template-strings");

export default async (req, res) => {
	let data = await db.query(escape`
	    SELECT * FROM dingel
	`);
	data = data[0];

	setTimeout(() => {
		res.json(data);
	}, 2000);
};
