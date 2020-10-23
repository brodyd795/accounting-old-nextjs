import {conn} from './transaction-wrapper-repository';

export default async props => {
	const {user, dateRange} = props;

	return conn(user).query(
		`SELECT * FROM transactions WHERE trn_id > ${dateRange.min} AND trn_id < ${dateRange.max} ORDER BY trn_id desc`
	);
};
