import addNewTransaction from '../../services/new-transaction-service';

export default async (req, res) => {
	try {
		const {newTransaction} = req.body;
		const user = req.query.user;

		await addNewTransaction({
			newTransaction,
			user
		});

		res.status(200).end();
	} catch (error) {
		res.status(400).json({
			error: error.message
		});
	}
};
