import React, {useState} from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import DatePicker from 'react-datepicker';

import {toCents, toDollars} from '../../lib/dollar-cents-helpers';

const StyledSelect = styled(Select)`
	width: 200px;
	color: black;
	text-align: left;
`;

const selectStyles = {
	control: base => ({
		...base,
		minHeight: 10
	}),
	dropdownIndicator: base => ({
		...base,
		padding: 4
	}),
	clearIndicator: base => ({
		...base,
		padding: 4
	}),
	multiValue: base => ({
		...base
	}),
	valueContainer: base => ({
		...base,
		padding: '0px 6px'
	}),
	input: base => ({
		...base,
		margin: 0,
		padding: 0
	})
};

const EditableRow = ({
	index,
	row,
	remove,
	edit,
	cancel,
	save,
	isEditing,
	idBeingEdited,
	accounts
}) => {
	const toAccount = accounts
		.find(category => category.label[0] === row.to_account[0])
		.options.find(option => option.value === row.to_account);

	const fromAccount = accounts
		.find(category => category.label[0] === row.from_account[0])
		.options.find(option => option.value === row.from_account);

	const year = parseInt(String(row.trn_id).replace(/(^\d{4})\d+/, '$1'));
	const month =
		parseInt(String(row.trn_id).replace(/^\d{4}(\d{2})\d+/, '$1')) - 1;
	const day = parseInt(
		String(row.trn_id).replace(/^\d{4}\d{2}(\d{2})\d+/, '$1')
	);
	const date = new Date(year, month, day);

	const [originalRow] = useState(row);
	const [editedRow, setEditedRow] = useState({
		...row,
		amount: toDollars(row.amount),
		from_balance: toDollars(row.from_balance),
		to_balance: toDollars(row.to_balance)
	});

	const handleDateEdit = date => {
		setEditedRow({
			...editedRow,
			trn_id: date
		});
	};

	const handleToAccountEdit = e => {
		console.log('e.value', e.value);
	};

	const handleFromAccountEdit = e => {
		console.log('e.value', e.value);
	};

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

		// save(editedRowInCents, originalRow, index);
	};

	const handleCancel = () => {
		setEditedRow(originalRow);
		cancel(originalRow);
	};

	return isEditing && idBeingEdited === row.trn_id ? (
		<tr>
			<td>
				<DatePicker
					selected={date}
					maxDate={new Date().setDate(new Date().getDate() + 1)}
					onChange={() => handleDateEdit(date)}
				/>
			</td>
			<td>
				<StyledSelect
					options={accounts}
					onChange={handleFromAccountEdit}
					styles={selectStyles}
					defaultValue={fromAccount}
				/>
			</td>
			<td>
				<StyledSelect
					options={accounts}
					onChange={handleToAccountEdit}
					styles={selectStyles}
					defaultValue={toAccount}
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
			<td key={`${index}-id`}>
				{String(row.trn_id).replace(/(\d{4})(\d{2})(\d{2})\d{2}/, '$2/$3/$1')}
			</td>
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
