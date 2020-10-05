import {wrappedEditTransaction} from '../../services/edit-service';

export default async (req, res) => {
	try {
		const {originalRow, editedRow} = req.body;
		const user = req.query.user;

		const result = await wrappedEditTransaction({
			originalRow,
			editedRow,
			user
		});

		if (result === 'OK') {
			res.status(200).json({result});
		} else {
			res.status(400).json({
				error: 'NOT OK'
			});
		}
	} catch (error) {
		res.status(400).json({
			error: error.message
		});
	}
};
