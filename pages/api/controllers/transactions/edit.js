import { editTransactionService } from "../../services/edit-service";

export default async (req, res) => {
	// TODO
	// let isAdmin = false;
	// if (process.env.ADMIN_EMAILS.includes(req.query.user)) {
	// 	isAdmin = true;
	// }

	// let data = await db.getAll(isAdmin);

	// res.json(data);

	try {
		const { originalRow, editedRow } = req.body;

		const result = await editTransactionService(originalRow, editedRow);

		if (result === "OK") {
			console.log("ok!");
			res.status(200).json({ result: result });
		} else {
			console.log("not ok!");
			res.status(400).json({ error: "NOT OK" });
		}
	} catch (error) {
		console.log("error", error);
		res.status(400).json({ error: error.message });
	}
};
