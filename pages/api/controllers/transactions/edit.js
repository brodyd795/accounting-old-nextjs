import editTransaction from '../../services/edit-service';

export default async (req, res) => {
	try {
		const {originalRow, editedRow, pageDetails} = req.body;
		const user = req.query.user;

		const data = await editTransaction({
			originalRow,
			editedRow,
			user,
			pageDetails
		});

		if (data) {
			const dataWithoutEmail = data.map(({user_email, ...rest}) => ({...rest}));

			res.status(200).json(dataWithoutEmail);
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
