const db = require("./db");

export default async ({ query: { account } }, res) => {
	if (account) {
		db.getAccountTransactions(account).then((results) => {
			if (results.length > 0) {
				res.json(results);
			} else {
				res.json({ message: `Results for account ${account} not found` });
			}
		});
		return;
	}
	const data = await db.getAccountsList();
	const accounts = data.map((account) => account.name);

	res.json(accounts);
};