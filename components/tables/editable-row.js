import React, {useState} from 'react';
import {toCents, toDollars} from '../../lib/dollar-cents-helpers';

const EditableRow = ({
	index,
	row,
	remove,
	edit,
	cancel,
	save,
	isEditing,
	idBeingEdited
}) => {
	const [originalRow] = useState(row);
	const [editedRow, setEditedRow] = useState({
		...row,
		amount: toDollars(row.amount),
		from_balance: toDollars(row.from_balance),
		to_balance: toDollars(row.to_balance)
	});

	const handleEdit = (key, e) => {
		setEditedRow({
			...editedRow,
			[key]: e.target.value
		});
	};

	const handleSave = () => {
		const editedRowInCents = {
			...editedRow,
			amount: toCents(editedRow.amount),
			from_balance: toCents(editedRow.from_balance),
			to_balance: toCents(editedRow.to_balance)
		};

		save(editedRowInCents, originalRow, index);
	};

	const handleCancel = () => {
		setEditedRow(originalRow);
		cancel(originalRow);
	};

	return isEditing && idBeingEdited === row.trn_id ? (
		<tr>
			<td>
				<input
					value={editedRow.trn_id}
					onChange={() => handleEdit('trn_id', event)}
				/>
			</td>
			<td>
				<input
					value={editedRow.from_account}
					onChange={() => handleEdit('from_account', event)}
				/>
			</td>
			<td>
				<input
					value={editedRow.to_account}
					onChange={() => handleEdit('to_account', event)}
				/>
			</td>
			<td>
				<input
					value={toDollars(editedRow.amount)}
					onChange={() => handleEdit('amount', event)}
				/>
			</td>
			<td>
				<input
					value={toDollars(editedRow.from_balance)}
					onChange={() => handleEdit('from_balance', event)}
				/>
			</td>
			<td>
				<input
					value={toDollars(editedRow.to_balance)}
					onChange={() => handleEdit('to_balance', event)}
				/>
			</td>
			<td>
				<input
					value={editedRow.comment}
					onChange={() => handleEdit('comment', event)}
				/>
			</td>

			<td>
				<button type={'button'} onClick={handleCancel}>
					Cancel
				</button>
				<button type={'button'} onClick={handleSave}>
					Save
				</button>
			</td>
		</tr>
	) : (
		<tr>
			<td key={`${index}-id`}>{row.trn_id}</td>
			<td key={`${index}-from-account`}>{row.from_account}</td>
			<td key={`${index}-to-account`}>{row.to_account}</td>
			<td key={`${index}-amount`}>{toDollars(row.amount)}</td>
			<td key={`${index}-from-balance`}>{toDollars(row.from_balance)}</td>
			<td key={`${index}-to-balance`}>{toDollars(row.to_balance)}</td>
			<td key={`${index}-comment`}>{row.comment}</td>
			<td>
				<button
					type={'button'}
					disabled={isEditing}
					onClick={() => edit(row.trn_id)}>
					Edit
				</button>
				<button
					type={'button'}
					disabled={isEditing}
					onClick={() => remove(row)}>
					Delete
				</button>
			</td>
		</tr>
	);
};

export default EditableRow;
