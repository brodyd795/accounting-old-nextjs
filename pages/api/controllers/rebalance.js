import rebalanceService from '../services/rebalance-service';

export default async (req, res) => {
	try {
		await rebalanceService();
		
		res.status(200).end();
	} catch (error) {
		res.status(500).end();
	}
};
