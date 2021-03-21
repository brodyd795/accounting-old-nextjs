import React, {useState} from 'react';
import fetch from 'isomorphic-unfetch';

import TableRow from './table-row';
import {StyledRecentTable, StyledRecentTableWrapper} from './styles';

import TransactionEditModal from '../modals/transaction-edit-modal';

const RecentTable = ({data}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [transactionBeingEdited, setTransactionBeingEdited] = useState(null);
	const [transactionsList, setTransactionsList] = useState(data.recentTransactions);

	const handleDelete = async (rowToDelete) => {
		const confirmDelete = confirm('Are you sure you wish to delete this transaction? This cannot be undone.');
	
		if (confirmDelete) {
			const res = await fetch(`/api/controllers/transactions/delete`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					transactionId: rowToDelete.transactionId
				})
			});

			if (res.ok) {
				const transactionsListCopy = transactionsList.filter(row => row.transactionId !== rowToDelete.transactionId);

				setTransactionsList(transactionsListCopy);
				alert('Success!');
			} else {
				alert('An error occurred. Please try again.');
			}
		}
	};

	const handleStartEditing = row => {
		setIsEditing(true);
		setTransactionBeingEdited(row);
	};

	return (
		<StyledRecentTableWrapper>
			<StyledRecentTable>
				<thead>
					<tr key={'headings'}>
						<th>{'Date'}</th>
						<th>{'From'}</th>
						<th>{'To'}</th>
						<th>{'Amount'}</th>
						<th>{'Comment'}</th>
						<th />
					</tr>
				</thead>
				<tbody>
					{transactionsList.map((row, index) => (
						<TableRow
							key={row.transactionId}
							index={index}
							row={row}
							remove={handleDelete}
							edit={handleStartEditing}
						/>
					))}
				</tbody>
			</StyledRecentTable>
			<TransactionEditModal
				isEditing={isEditing}
				setIsEditing={setIsEditing}
				transactionBeingEdited={transactionBeingEdited}
				accounts={data.accounts}
			/>
		</StyledRecentTableWrapper>
	);
};

export default RecentTable;
