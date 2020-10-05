import escape from 'sql-template-strings';

import {withTransactionWrapper, conn} from './transaction-wrapper-repository';

export const insertTransaction = async props => {
	const {transaction, user} = props;

	try {
		const {
			id,
			userEmail,
			toAccount,
			fromAccount,
			amount,
			toBalance,
			fromBalance,
			comment
		} = transaction;

		await conn(user).query(
			escape`INSERT INTO transactions VALUES(${id}, ${userEmail}, ${fromAccount}, ${toAccount}, ${amount}, ${fromBalance}, ${toBalance}, ${comment})`
		);
		await conn(user).query(
			escape`UPDATE transactions SET to_balance = to_balance + ${amount} WHERE trn_id > ${id} AND (to_account = ${toAccount} OR to_account = ${fromAccount})`
		);
		await conn(user).query(
			escape`UPDATE transactions SET from_balance = from_balance - ${amount} WHERE trn_id > ${id} AND (from_account = ${toAccount} OR from_account = ${fromAccount})`
		);

		return 'OK';
	} catch (error) {
		throw new Error(error);
	}
};

export const wrappedInsertTransaction = async props =>
	withTransactionWrapper(insertTransaction, props);
