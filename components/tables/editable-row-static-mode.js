import React from 'react';

import {toDollars} from '../../lib/currency-helpers';

const EditableRowStaticMode = ({
	index,
	row,
	showBalances,
	isEditing,
	remove,
	edit
}) => {
	return (
		<tr>
			<td key={`${index}-id`}>{row.date}</td>
			<td key={`${index}-from-account`}>{row.fromAccountName}</td>
			<td key={`${index}-to-account`}>{row.toAccountName}</td>
			<td key={`${index}-amount`}>{toDollars(row.amount)}</td>
			{showBalances && (
				<>
					<td key={`${index}-from-balance`}>{toDollars(row.fromBalance)}</td>
					<td key={`${index}-to-balance`}>{toDollars(row.toBalance)}</td>
				</>
			)}
			<td key={`${index}-comment`}>{row.comment}</td>
			<td>
				<button
					type={'button'}
					disabled={isEditing}
					onClick={() => edit(row)}>
					{'Edit'}
				</button>
				<button
					type={'button'}
					disabled={isEditing}
					onClick={() => remove(row)}>
					{'Delete'}
				</button>
			</td>
		</tr>
	);
};

export default EditableRowStaticMode;
