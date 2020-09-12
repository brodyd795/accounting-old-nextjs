import { deleteTransactionService } from "../../services/delete-service";

export default async (req, res) => {
	// TODO
	// let isAdmin = false;
	// if (process.env.ADMIN_EMAILS.includes(req.query.user)) {
	// 	isAdmin = true;
	// }

	// res.json(data);
	try {
		const result = await deleteTransactionService(req.body.rowToDelete);
		if (result === "OK") {
			res.status(200).json({ result: result });
		} else {
			res.status(400).json({ error: "NOT OK" });
		}
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};
