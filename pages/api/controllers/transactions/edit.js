import editTransaction from '../../services/edit-service';

export default async (req, res) => {
	try {
		await editTransaction(req.body);
		
		res.status(200).send({message: 'OK'});
	} catch (error) {
		res.status(400).json({
			error: error.message
		});
	}
};
