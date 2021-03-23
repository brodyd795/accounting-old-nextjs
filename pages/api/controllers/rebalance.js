import rebalanceService from '../services/rebalance-service';

export default async (req, res) => {
	try {
		const {date = null} = req.body;

		await rebalanceService({date});
		
		res.status(200).end();
	} catch (error) {
		res.status(500).end();
	}
};
