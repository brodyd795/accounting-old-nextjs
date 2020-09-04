import { useState } from "react";

const EditableRow = ({
	index,
	row,
	remove,
	edit,
	cancel,
	save,
	isEditing,
	idBeingEdited,
}) => {
	const [originalRow, setOriginalRow] = useState(row);
	const [editedRow, setEditedRow] = useState(row);

	const handleEdit = (key, e) => {
		setEditedRow({
			...editedRow,
			[key]: e.target.value,
		});
	};

	const handleSave = () => {
		save(editedRow, originalRow, index);
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
					onChange={() => handleEdit("trn_id", event)}
				/>
			</td>
			<td>
				<input
					value={editedRow.to_account}
					onChange={() => handleEdit("to_account", event)}
				/>
			</td>
			<td>
				<input
					value={editedRow.from_account}
					onChange={() => handleEdit("from_account", event)}
				/>
			</td>
			<td>
				<input
					value={editedRow.amount}
					onChange={() => handleEdit("amount", event)}
				/>
			</td>
			<td>
				<input
					value={editedRow.to_balance}
					onChange={() => handleEdit("to_balance", event)}
				/>
			</td>
			<td>
				<input
					value={editedRow.from_balance}
					onChange={() => handleEdit("from_balance", event)}
				/>
			</td>
			<td>
				<input
					value={editedRow.comment}
					onChange={() => handleEdit("comment", event)}
				/>
			</td>

			<td>
				<button onClick={handleCancel}>Cancel</button>
				<button onClick={handleSave}>Save</button>
			</td>
		</tr>
	) : (
		<tr>
			{Object.values(row).map((cell, key) => (
				<td key={key}>{cell}</td>
			))}
			<td>
				<button disabled={isEditing} onClick={() => edit(row.trn_id)}>
					Edit
				</button>
				<button disabled={isEditing} onClick={() => remove(row)}>
					Delete
				</button>
			</td>
		</tr>
	);
};

export default EditableRow;
