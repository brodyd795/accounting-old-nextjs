import {deleteSchema} from '../../../../public/schemas/delete-schema';
import deleteTransaction from '../../services/delete-service';

export default async (req, res) => {
	try {
		await deleteSchema.validate(req.body, {abortEarly: false});
		await deleteTransaction({
			transactionId: req.body.transactionId,
			date: req.body.date
		});

		res.status(200).end();
	} catch (error) {
		console.log('error', error)
		res.status(400).json({error});
	}
};
