import React from 'react';

import {toDollars} from '../../lib/currency-helpers';

const TableRow = ({index, row, remove, edit}) => {
	const {date, fromAccountName, toAccountName, amount, comment} = row;

	return (
		<tr>
			<td key={`${index}-id`}>{date}</td>
			<td key={`${index}-from-account`}>{fromAccountName}</td>
			<td key={`${index}-to-account`}>{toAccountName}</td>
			<td key={`${index}-amount`}>{toDollars(amount)}</td>
			<td key={`${index}-comment`}>{comment}</td>
			<td>
				<button
					type={'button'}
					onClick={() => edit(row)}>
					{'Edit'}
				</button>
				<button
					type={'button'}
					onClick={() => remove(row)}>
					{'Delete'}
				</button>
			</td>
		</tr>
	);
};

export default TableRow;
