import escape from 'sql-template-strings';

import {conn} from './transaction-wrapper-repository';

export const selectAll = async props => {
	const {user} = props;

	const allTransactions = await conn(user).query(
		'select * from transactions order by trn_id asc'
	);

	return allTransactions;
};

export const createTempTable = async props => {
	const {user} = props;

	await conn(user).query(
		'create table if not exists transactions_TEMP like transactions'
	);

	return;
};

export const renameTablesAndDropOldTable = async props => {
	const {user} = props;

	await conn(user).query(
		`rename table transactions TO transactions_OLD, transactions_TEMP TO transactions`
	);
	await conn(user).query(`drop table transactions_OLD`);

	return;
};

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

export const deleteAllBalances = async () =>
	conn().query(
		escape`
			DELETE FROM
				balances
			WHERE
				balanceId > 0
		`
	);

export const selectAllTransactions = async () =>
    conn().query(
		escape`
			SELECT
				date,
				fromAccountId,
				toAccountId,
				amount
			FROM
				transactions
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
