import editTransaction from '../../services/edit-service';

export default async (req, res) => {
	try {
		const response = await editTransaction(req.body);
		
		res.status(200).json({message: 'foo'})
	} catch (error) {
		res.status(400).json({
			error: error.message
		});
	}
};
