import {isAdmin} from '../services/is-admin-service';
import rebalanceService from '../services/rebalance-service';

export default async (req, res) => {
	try {
		const user = req.query.user;

		if (isAdmin(user)) {
			await rebalanceService({user});

			res.status(200).end();
		}

		res.status(401).end();
	} catch (error) {
		res.status(500).end();
	}
};
