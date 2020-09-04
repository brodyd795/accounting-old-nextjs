import { useState } from "react";
import styled from "styled-components";
import fetch from "isomorphic-unfetch";

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

	const handleDelete = (rowToDelete) => {
		const confirmDelete = confirm(
			"Are you sure you wish to delete this transaction? This cannot be undone."
		);
		if (confirmDelete) {
			fetch("/api/transactions/delete", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ rowToDelete }),
			}).then((res) => {
				if (res.ok) {
					const transactionsListCopy = transactionsList.filter(
						(row) => row.trn_id !== rowToDelete.trn_id
					);
					setTransactionsList(transactionsListCopy);
					alert("Success!");
				} else {
					alert("An error occurred. Please try again.");
				}
			});
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

	const handleSave = (editedRow, originalRow, index) => {
		fetch("/api/transactions/edit", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ editedRow, originalRow }),
		}).then((res) => {
			if (res.ok) {
				const transactionsListCopy = transactionsList.map((row, copyIndex) =>
					copyIndex === index ? editedRow : row
				);
				setTransactionsList(transactionsListCopy);
				setIsEditing(false);
			} else {
				console.log(res.status);
			}
		});
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
						index={index}
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
