import React, {useState} from 'react';
import styled from 'styled-components';
import fetch from 'isomorphic-unfetch';

import EditableRow from './editable-row';

import {useFetchUser} from '../../lib/user';

const TableWrapper = styled.div`
	overflow-x: scroll;
`;

const StyledTable = styled.table`
	border: 1px solid black;

	th,
	td {
		padding: 5px;
		text-align: center;
	}
`;

const RecentTable = ({data}) => {
	const {user, loading} = useFetchUser();
	const [isEditing, setIsEditing] = useState(null);
	const [idBeingEdited, setIdBeingEdited] = useState(null);
	const [transactionsList, setTransactionsList] = useState(data);

	const handleDelete = rowToDelete => {
		const confirmDelete = confirm(
			'Are you sure you wish to delete this transaction? This cannot be undone.'
		);

		if (confirmDelete) {
			fetch(`/api/controllers/transactions/delete?user=${user.email}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({rowToDelete})
			}).then(res => {
				if (res.ok) {
					const transactionsListCopy = transactionsList.filter(
						row => row.trn_id !== rowToDelete.trn_id
					);

					setTransactionsList(transactionsListCopy);
					alert('Success!');
				} else {
					alert('An error occurred. Please try again.');
				}
			});
		}
	};

	const handleStartEditing = id => {
		setIsEditing(true);
		setIdBeingEdited(id);
	};

	const handleCancel = cancelledRow => {
		const transactionsListCopy = transactionsList.map(row =>
			row.trn_id === cancelledRow.trn_id ? cancelledRow : row
		);

		setTransactionsList(transactionsListCopy);
		setIsEditing(false);
	};

	const handleSave = async (editedRow, originalRow, index) => {
		const res = await fetch(
			`/api/controllers/transactions/edit?user=${user.email}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					editedRow,
					originalRow
				})
			}
		);
		const json = await res.json();

		if (json) {
			let count = 0;
			const transactionsListCopy = transactionsList;
			while (count <= index) {
				transactionsListCopy[count] = json[count];
				count++;
			}

			setTransactionsList(transactionsListCopy);
		} else {
			alert('An error occurred. Please try again.');
		}

		setIsEditing(false);
	};

	return (
		<TableWrapper>
			<StyledTable>
				<tbody>
					<tr key='headings'>
						<th>Id</th>
						<th>From</th>
						<th>To</th>
						<th>Amount</th>
						<th>From Balance</th>
						<th>To Balance</th>
						<th>Comment</th>
					</tr>
					{transactionsList.map((row, index) => (
						<EditableRow
							key={row.trn_id}
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
		</TableWrapper>
	);
};

export default RecentTable;
