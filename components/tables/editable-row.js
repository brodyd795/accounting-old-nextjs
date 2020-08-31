import { useState } from "react";

const EditableRow = ({
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
			trn_id: e.target.value,
		});
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
					value={row.to_account}
					onChange={() => handleEdit("to_account")}
				/>
			</td>
			<td>
				<input
					value={row.from_account}
					onChange={() => handleEdit("from_account")}
				/>
			</td>
			<td>
				<input value={row.amount} onChange={() => handleEdit("amount")} />
			</td>
			<td>
				<input
					value={row.to_balance}
					onChange={() => handleEdit("to_balance")}
				/>
			</td>
			<td>
				<input
					value={row.from_balance}
					onChange={() => handleEdit("from_balance")}
				/>
			</td>
			<td>
				<input value={row.comment} onChange={() => handleEdit("comment")} />
			</td>

			<td>
				<button onClick={() => cancel(row.trn_id)}>Cancel</button>
				<button onClick={() => save(row.trn_id)}>Save</button>
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
				<button disabled={isEditing} onClick={() => remove(row.trn_id)}>
					Delete
				</button>
			</td>
		</tr>
	);
};

export default EditableRow;
