import { useState } from "react";
import styled from "styled-components";

import EditableRow from "./editable-row";

const StyledTable = styled.table`
	border: 1px solid black;

	th,
	td {
		padding: 5px;
		text-align: center;
	}
`;

const RecentTable = ({ data }) => {
	const [isEditing, setIsEditing] = useState(null);
	const [idBeingEdited, setIdBeingEdited] = useState(null);
	const [transactionsList, setTransactionsList] = useState(data);

	const handleDelete = (id) => {
		const confirmDelete = confirm(
			"Are you sure you wish to delete this transaction? This cannot be undone."
		);
		if (confirmDelete) {
			const transactionsListCopy = transactionsList.filter(
				(row) => row.trn_id !== id
			);
			setTransactionsList(transactionsListCopy);
		}
	};

	const handleStartEditing = (id) => {
		setIsEditing(true);
		setIdBeingEdited(id);
	};

	const handleCancel = (cancelledRow) => {
		const transactionsListCopy = transactionsList.map((row) =>
			row.trn_id === cancelledRow.trn_id ? cancelledRow : row
		);
		setTransactionsList(transactionsListCopy);
		setIsEditing(false);
	};

	const handleSave = (editedRow) => {
		const transactionsListCopy = transactionsList.map((row) =>
			row.trn_id === editedRow.trn_id ? editedRow : row
		);
		setTransactionsList(transactionsListCopy);
		setIsEditing(false);
	};

	return (
		<StyledTable>
			<tbody>
				<tr key="headings">
					<th>Id</th>
					<th>To</th>
					<th>From</th>
					<th>Amount</th>
					<th>To Balance</th>
					<th>From Balance</th>
					<th>Comment</th>
				</tr>
				{transactionsList.map((row, index) => (
					<EditableRow
						key={index}
						row={row}
						remove={handleDelete}
						edit={handleStartEditing}
						cancel={handleCancel}
						save={handleSave}
						isEditing={isEditing}
						idBeingEdited={idBeingEdited}
					/>
				))}
			</tbody>
		</StyledTable>
	);
};

export default RecentTable;
