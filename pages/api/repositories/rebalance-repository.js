import escape from 'sql-template-strings';

import {conn} from './transaction-wrapper-repository';

export const insertTransaction = async props => {
	const {transaction, user} = props;

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
		escape`INSERT INTO transactions_TEMP VALUES(${id}, ${userEmail}, ${fromAccount}, ${toAccount}, ${amount}, ${fromBalance}, ${toBalance}, ${comment})`
	);
	await conn(user).query(
		escape`UPDATE transactions_TEMP SET to_balance = to_balance + ${amount} WHERE trn_id > ${id} AND (to_account = ${toAccount} OR to_account = ${fromAccount})`
	);
	await conn(user).query(
		escape`UPDATE transactions_TEMP SET from_balance = from_balance - ${amount} WHERE trn_id > ${id} AND (from_account = ${toAccount} OR from_account = ${fromAccount})`
	);

	return 'OK';
};

export const getPreviousBalances = async ({date}) =>
	conn().query(
		escape`
			SELECT
				accountId,
				balance,
				date
			FROM
				balances
			WHERE
				date = ${date}
		`
	);

export const deleteBalancesAfterDate = async ({date}) =>
	conn().query(
		escape`
			DELETE FROM
				balances
			WHERE
				date > ${date}
		`
	);

export const deleteAllBalances = async () =>
	conn().query(
		escape`
			DELETE FROM
				balances
			WHERE
				date > '2000-01-01'
		`
	);

export const selectAllTransactions = async ({date}) =>
    conn().query(
		escape`
			SELECT
				date,
				fromAccountId,
				toAccountId,
				amount
			FROM
				transactions
			WHERE
				date > '2000-01-01'
			ORDER BY
				date
		`
	);

export const selectTransactionsAfterDate = async ({date}) =>
    conn().query(
		escape`
			SELECT
				date,
				fromAccountId,
				toAccountId,
				amount
			FROM
				transactions
			WHERE
				date >= ${date}
			ORDER BY
				date
		`
	);

export const reinsertAllBalancesNew = async (balancesString) =>
    conn().query(`
		INSERT INTO
			balances (accountId, balance, date)
		VALUES
			${balancesString}
	`);
