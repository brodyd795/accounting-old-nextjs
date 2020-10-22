import escape from 'sql-template-strings';

import {conn} from './transaction-wrapper-repository';

export default async props => {
	const {id, user} = props;

	const results = await conn(user).query(
		escape`SELECT * FROM transactions WHERE trn_id >= ${id} ORDER BY trn_id desc`
	);

	return results;
};
