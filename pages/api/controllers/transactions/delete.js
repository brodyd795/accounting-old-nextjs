import deleteTransaction from '../../services/delete-service';

export default async (req, res) => {
	try {
		await deleteTransaction({
			transactionId: req.body.transactionId
		});

		res.status(200).json({message: 'OK'});
	} catch (error) {
		console.log('error', error)
		res.status(400).json({error: error.message});
	}
};
