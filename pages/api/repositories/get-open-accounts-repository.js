import {conn} from './transaction-wrapper-repository';

export default async props => {
	const {user} = props;

	return conn(user).query(`SELECT acc_name FROM accounts WHERE open = true`);
};
