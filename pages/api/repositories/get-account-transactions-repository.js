import escape from 'sql-template-strings';

import {conn} from './transaction-wrapper-repository';

export default async ({account, dateRange}) => {
	const {startDate, endDate} = dateRange;

	return conn().query(
		escape`
			SELECT
				transactions.transactionId,
				transactions.date,
				transactions.fromAccountId,
				transactions.toAccountId,
				toAccounts.accountName toAccountName,
				fromAccounts.accountName fromAccountName,
				toAccounts.category toAccountCategory,
				fromAccounts.category fromAccountCategory,
				toBalances.balance toBalance,
				fromBalances.balance fromBalance,
				transactions.amount,
				transactions.comment
			FROM
				transactions
			INNER JOIN
				accounts toAccounts
			ON
				toAccounts.accountId = transactions.toAccountId
			INNER JOIN
				accounts fromAccounts
			ON
				fromAccounts.accountId = transactions.fromAccountId
			INNER JOIN
				balances fromBalances
			ON
				fromBalances.accountId = transactions.fromAccountId
			AND
				fromBalances.date = ${startDate}
			INNER JOIN
				balances toBalances
			ON
				toBalances.accountId = transactions.toAccountId
			AND
				toBalances.date = ${startDate}
			WHERE
				toAccounts.accountName = ${account}
			OR
				fromAccounts.accountName = ${account}
			AND
				transactions.date > ${startDate}
			AND
				transactions.date < ${endDate}
			ORDER BY
				transactions.date
			DESC
		`);
};
