const db = require("../db");

import transformAccountsListForDropdown from "../helpers/accounts-select-data-transform";

export default async (req, res) => {
	const data = await db.getAccountsList();
	const accounts = data.map((account) => account.acc_name);
	const transformedAccountsList = transformAccountsListForDropdown(accounts);

	res.json(transformedAccountsList);
};
