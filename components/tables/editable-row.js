const EditableRow = ({ row, index, remove }) => {
	return (
		<tr>
			{Object.values(row).map((cell, key) => (
				<td key={key}>{cell}</td>
			))}
			<td>
				<button onClick={() => remove(row.trn_id)}>Delete</button>
			</td>
		</tr>
	);
};

export default EditableRow;
