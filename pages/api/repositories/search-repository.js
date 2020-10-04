import {createConn} from './create-connection-repository';

export const search = async params => {
	const conn = await createConn();

	try {
		await conn.query('START TRANSACTION');

		let {fromAmount, toAmount, keyword} = params;

		const {toAccount, fromAccount, dateRange} = params;

		let query = [];

		if (toAccount !== '' && toAccount !== null) {
			query.push(`Debit='${toAccount.value}'`);
		}

		if (fromAccount !== '' && fromAccount !== null) {
			query.push(`Credit='${fromAccount.value}'`);
		}

		if (dateRange !== '') {
			query.push(
				`TransactionId>=${dateRange.start} AND TransactionId<${dateRange.end}`
			);
		}

		if (fromAmount !== '') {
			fromAmount = parseInt(fromAmount.replace(/[$.]/g, ''));
			query.push(`Amount>=${fromAmount}`);
		}

		if (toAmount !== '') {
			toAmount = parseInt(toAmount.replace(/[$.]/g, ''));
			query.push(`Amount<=${toAmount}`);
		}

		if (keyword !== '') {
			keyword = keyword.toLowerCase();
			query.push(
				`Debit COLLATE UTF8_GENERAL_CI LIKE '%${keyword}%' OR Credit COLLATE UTF8_GENERAL_CI LIKE '%${keyword}%' OR Description COLLATE UTF8_GENERAL_CI LIKE '%${keyword}%'`
			);
		}

		query = query.join(' AND ');

		const results = await conn.query(`SELECT * FROM first WHERE ${query}`);

		await conn.query('COMMIT');

		return results;
	} catch (error) {
		await conn.query('ROLLBACK');

		return 'NOT OK';
	} finally {
		await conn.end();
	}
};
