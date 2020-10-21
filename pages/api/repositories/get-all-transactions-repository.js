import {conn} from './transaction-wrapper-repository';

export default async props => {
	const {user} = props;

	return conn(user).query(`SELECT * FROM transactions ORDER BY trn_id desc`);
};
