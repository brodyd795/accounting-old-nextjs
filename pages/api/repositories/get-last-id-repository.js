import escape from 'sql-template-strings';

import {withTransactionWrapper, conn} from './transaction-wrapper-repository';

export const getLastId = async props => {
	const {date, user} = props;

	let lastId;

	if (date) {
		lastId = await conn(user).query(
			escape`SELECT MAX(trn_id) max_id FROM transactions WHERE trn_id BETWEEN ${date} AND ${
				date + 99
			}`
		);
	} else {
		lastId = await conn(user).query(
			`SELECT MAX(trn_id) max_id FROM transactions`
		);
	}

	lastId = lastId[0]['max_id'] || date;

	return lastId;
};

export const wrappedGetLastId = async props =>
	withTransactionWrapper(getLastId, props);
