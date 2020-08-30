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
	const [isEditing, setIsEditing] = useState(false);
	const [idBeingEdited, setIdBeingEdited] = useState(null);
	const [transactionsList, setTransactionsList] = useState(data);
	const [originalTransaction, setOriginalTransaction] = useState(null);
	const [editedTransaction, setEditedTransaction] = useState(null);

	const handleDeleteClick = (id) => {
		const transactionsListCopy = transactionsList.filter(
			(row) => row.trn_id !== id
		);
		setTransactionsList(transactionsListCopy);
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
						index={index}
						remove={handleDeleteClick}
					/>
				))}
			</tbody>
		</StyledTable>
	);
};

export default RecentTable;
