import React from 'react';

import {cleanAccountId} from '../../lib/account-helpers';
import {toDollars} from '../../lib/currency-helpers';
import {trnIdToHyphenatedDate} from '../../lib/date-helpers';

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
			<td key={`${index}-id`}>{trnIdToHyphenatedDate(row.trn_id)}</td>
			<td key={`${index}-from-account`}>{cleanAccountId(row.from_account)}</td>
			<td key={`${index}-to-account`}>{cleanAccountId(row.to_account)}</td>
			<td key={`${index}-amount`}>{toDollars(row.amount)}</td>
			{showBalances && (
				<>
					<td key={`${index}-from-balance`}>{toDollars(row.from_balance)}</td>
					<td key={`${index}-to-balance`}>{toDollars(row.to_balance)}</td>
				</>
			)}
			<td key={`${index}-comment`}>{row.comment}</td>
			<td>
				<button
					type={'button'}
					disabled={isEditing}
					onClick={() => edit(row.trn_id)}>
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
