import escape from 'sql-template-strings';

import {conn} from './transaction-wrapper-repository';

export default async props => {
	const {date, user} = props;

	let lastId;

	if (date) {
		lastId = await conn(user).query(
			escape`SELECT MAX(trn_id) max_id FROM transactions WHERE trn_id BETWEEN ${parseInt(
				date
			)} AND ${parseInt(date) + 99}`
		);
	} else {
		lastId = await conn(user).query(
			`SELECT MAX(trn_id) max_id FROM transactions`
		);
	}

	if (lastId[0]['max_id']) {
		return lastId[0]['max_id'] + 1;
	}

	return parseInt(date);
};
