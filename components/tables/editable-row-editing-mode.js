import React, {useState} from 'react';

import {toCents, toDollars} from '../../lib/currency-helpers';
import {trnIdToNewDate} from '../../lib/date-helpers';

import DateSelector from './selectors/date-selector';
import ToAccountSelector from './selectors/to-account-selector';
import FromAccountSelector from './selectors/from-account-selector';
import AmountSelector from './selectors/amount-selector';
import FromBalanceSelector from './selectors/from-balance-selector';
import ToBalanceSelector from './selectors/to-balance-selector';
import CommentSelector from './selectors/comment-selector';

const EditableRowEditingMode = ({
	accounts,
	cancel,
	showBalances,
	save,
	row
}) => {
	const date = trnIdToNewDate(row.trn_id);

	const fromAccount = accounts
		.find(category => category.label[0] === row.from_account[0])
		.options.find(option => option.value === row.from_account);

	const toAccount = accounts
		.find(category => category.label[0] === row.to_account[0])
		.options.find(option => option.value === row.to_account);

	const [originalRow] = useState(row);
	const [editedRow, setEditedRow] = useState({
		trn_id: date,
		from_account: fromAccount,
		to_account: toAccount,
		amount: toDollars(row.amount),
		from_balance: toDollars(row.from_balance),
		to_balance: toDollars(row.to_balance),
		comment: row.comment
	});

	const handleSave = () => {
		const newDate = editedRow.trn_id
			.toISOString()
			.replace(/^(\d{4})-(\d{2})-(\d{2}).+/, '$1$2$3');

		const editedRowInCents = {
			trn_id: newDate,
			from_account: editedRow.from_account.value,
			to_account: editedRow.to_account.value,
			amount: toCents(editedRow.amount),
			from_balance: toCents(editedRow.from_balance),
			to_balance: toCents(editedRow.to_balance),
			comment: editedRow.comment
		};

		save(editedRowInCents, originalRow);
	};

	return (
		<tr>
			<td>
				<DateSelector setEditedRow={setEditedRow} editedRow={editedRow} />
			</td>
			<td>
				<FromAccountSelector
					accounts={accounts}
					setEditedRow={setEditedRow}
					editedRow={editedRow}
				/>
			</td>
			<td>
				<ToAccountSelector
					accounts={accounts}
					setEditedRow={setEditedRow}
					editedRow={editedRow}
				/>
			</td>
			<td>
				<AmountSelector value={editedRow.amount} setEditedRow={setEditedRow} />
			</td>
			{showBalances && (
				<>
					<td>
						<FromBalanceSelector
							setEditedRow={setEditedRow}
							value={editedRow.from_balance}
						/>
					</td>
					<td>
						<ToBalanceSelector
							setEditedRow={setEditedRow}
							value={editedRow.to_balance}
						/>
					</td>
				</>
			)}
			<td>
				<CommentSelector
					setEditedRow={setEditedRow}
					value={editedRow.comment}
				/>
			</td>

			<td>
				<button type={'button'} onClick={handleSave}>
					{'Save'}
				</button>
				<button type={'button'} onClick={() => cancel(originalRow)}>
					{'Cancel'}
				</button>
			</td>
		</tr>
	);
};

export default EditableRowEditingMode;
