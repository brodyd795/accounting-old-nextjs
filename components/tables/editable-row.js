const EditableRow = ({
	row,
	remove,
	edit,
	cancel,
	save,
	isEditing,
	idBeingEdited,
}) => {
	return isEditing && idBeingEdited === row.trn_id ? (
		<tr>
			{Object.values(row).map((cell, key) => (
				<td key={key}>{cell}</td>
			))}
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
			{!isEditing && (
				<td>
					<button onClick={() => edit(row.trn_id)}>Edit</button>
					<button onClick={() => remove(row.trn_id)}>Delete</button>
				</td>
			)}
		</tr>
	);
};

export default EditableRow;
