import escape from 'sql-template-strings';

import {conn} from './transaction-wrapper-repository';

export default async props => {
	const {fromAccountId, toAccountId, amount, date, comment, transactionId} = props;

	return conn().query(
		escape`
            UPDATE
                transactions
            SET
                fromAccountId = ${fromAccountId},
                toAccountId = ${toAccountId},
                amount = ${amount},
                date = ${date},
                comment = ${comment}
            WHERE
                transactionId = ${transactionId}
        `
	);
};
