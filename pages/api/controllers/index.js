import { checkIsAdmin } from "../services/is-admin-service";

const db = require("../db");

export default async (req, res) => {
	const isAdmin = checkIsAdmin(req.query.user);
	const data = await db.getAllAccountBalances(isAdmin);
	res.json(data);
};
