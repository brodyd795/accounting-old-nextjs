const db = require("./db");
const escape = require("sql-template-strings");

export default async (req, res) => {
	const data = await db.query(escape`
        SELECT * FROM dingel
    `);
	res.status(200).json({ data: data });
};
