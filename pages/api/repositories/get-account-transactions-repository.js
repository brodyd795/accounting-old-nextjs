import escape from 'sql-template-strings';

import {conn} from './transaction-wrapper-repository';

export default async ({account, dateRange}) => {
	const {startDate, endDate} = dateRange;

	return conn().query(
		escape`
			SELECT DISTINCT
				transactions.transactionId,
				transactions.date,
				transactions.fromAccountId,
				transactions.toAccountId,
				toAccounts.accountName toAccountName,
				fromAccounts.accountName fromAccountName,
				toBalances.balance toBalance,
				fromBalances.balance fromBalance,
				transactions.amount,
				transactions.comment
			FROM
				transactions
			INNER JOIN
				accounts toAccounts
			ON
				toAccounts.accountId = transactions.fromAccountId
			INNER JOIN
				accounts fromAccounts
			ON
				fromAccounts.accountId = transactions.toAccountId
			INNER JOIN
				balances fromBalances
			ON
				fromBalances.accountId = transactions.fromAccountId
			INNER JOIN
				balances toBalances
			ON
				toBalances.accountId = transactions.toAccountId
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
