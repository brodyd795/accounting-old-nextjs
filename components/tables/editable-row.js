import React, {useState} from 'react';

import {toCents, toDollars} from '../../lib/dollar-cents-helpers';

import DateSelector from './date-selector';
import ToAccountSelector from './to-account-selector';
import FromAccountSelector from './from-account-selector';
import AmountSelector from './amount-selector';
import FromBalanceSelector from './from-balance-selector';
import ToBalanceSelector from './to-balance-selector';
import CommentSelector from './comment-selector';

const EditableRow = ({
	index,
	row,
	remove,
	edit,
	cancel,
	save,
	isEditing,
	idBeingEdited,
	accounts,
	showBalances
}) => {
	const year = parseInt(String(row.trn_id).replace(/(^\d{4})\d+/, '$1'));
	const month =
		parseInt(String(row.trn_id).replace(/^\d{4}(\d{2})\d+/, '$1')) - 1;
	const day = parseInt(
		String(row.trn_id).replace(/^\d{4}\d{2}(\d{2})\d+/, '$1')
	);
	const date = new Date(year, month, day);

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
			amount: toCents(editedRow.amount.replace(/[$,]/g, '')),
			from_balance: toCents(editedRow.from_balance.replace(/[$,]/g, '')),
			to_balance: toCents(editedRow.to_balance.replace(/[$,]/g, '')),
			comment: editedRow.comment
		};

		save(editedRowInCents, originalRow);
	};

	const handleCancel = () => {
		cancel(originalRow);
	};

	return isEditing && idBeingEdited === row.trn_id ? (
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
				<button type={'button'} onClick={handleCancel}>
					{'Cancel'}
				</button>
			</td>
		</tr>
	) : (
		<tr>
			<td key={`${index}-id`}>
				{String(row.trn_id).replace(/(\d{4})(\d{2})(\d{2})\d{2}/, '$2/$3/$1')}
			</td>
			<td key={`${index}-from-account`}>
				{row.from_account.slice(2).replace(/_/g, ' ')}
			</td>
			<td key={`${index}-to-account`}>
				{row.to_account.slice(2).replace(/_/g, ' ')}
			</td>
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

export default EditableRow;
