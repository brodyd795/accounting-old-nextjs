import escape from 'sql-template-strings';

import {conn} from './transaction-wrapper-repository';

export default async props => {
	const {transactionId} = props;

	return conn().query(
		escape`
			DELETE FROM
				transactions
			WHERE
				transactionId = ${transactionId}
		`
	);
};
