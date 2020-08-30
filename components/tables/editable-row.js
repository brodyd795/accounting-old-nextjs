const EditableRow = ({ row }) => {
	return (
		<tr>
			{Object.values(row).map((cell, key) => (
				<td key={key}>{cell}</td>
			))}
		</tr>
	);
};

export default EditableRow;
