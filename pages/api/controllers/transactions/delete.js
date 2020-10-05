import {deleteTransactionService} from '../../services/delete-service';

export default async (req, res) => {
	try {
		const user = req.query.user;
		const result = await deleteTransactionService(req.body.rowToDelete, user);

		if (result === 'OK') {
			res.status(200).json({result});
		} else {
			res.status(400).json({error: 'NOT OK'});
		}
	} catch (error) {
		res.status(400).json({error: error.message});
	}
};
