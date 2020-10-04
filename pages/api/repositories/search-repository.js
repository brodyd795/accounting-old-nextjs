import escape from 'sql-template-strings';

import {withTransactionWrapper, conn} from './transaction-wrapper-repository';

export const search = async params => {
	let {fromAmount, toAmount, keyword} = params;

	const {toAccount, fromAccount, dateRange} = params;

	const queries = [];

	if (toAccount !== '' && toAccount !== null) {
		queries.push(`Debit='${toAccount.value}'`);
	}

	if (fromAccount !== '' && fromAccount !== null) {
		queries.push(`Credit='${fromAccount.value}'`);
	}

	if (dateRange !== '') {
		queries.push(
			`TransactionId>=${dateRange.start} AND TransactionId<${dateRange.end}`
		);
	}

	if (fromAmount !== '') {
		fromAmount = parseInt(fromAmount.replace(/[$.]/g, ''));
		queries.push(`Amount>=${fromAmount}`);
	}

	if (toAmount !== '') {
		toAmount = parseInt(toAmount.replace(/[$.]/g, ''));
		queries.push(`Amount<=${toAmount}`);
	}

	if (keyword !== '') {
		keyword = keyword.toLowerCase();
		queries.push(
			escape`Debit COLLATE UTF8_GENERAL_CI LIKE '%${keyword}%' OR Credit COLLATE UTF8_GENERAL_CI LIKE '%${keyword}%' OR Description COLLATE UTF8_GENERAL_CI LIKE '%${keyword}%'`
		);
	}

	const queryString = queries.join(' AND ');

	const results = await conn.query(`SELECT * FROM first WHERE ${queryString}`);

	return results;
};

export const wrappedSearch = async props =>
	withTransactionWrapper(search, props);
