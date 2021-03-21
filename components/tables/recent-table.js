import React, {useState} from 'react';
import fetch from 'isomorphic-unfetch';

import EditableRow from './editable-row';
import {StyledRecentTable, StyledRecentTableWrapper} from './styles';

import TransactionEditModal from '../modals/transaction-edit-modal';

const RecentTable = ({data, type, account = null}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [transactionBeingEdited, setTransactionBeingEdited] = useState(null);
	const [transactionsList, setTransactionsList] = useState(data.recentTransactions);

	const handleDelete = rowToDelete => {
		const confirmDelete = confirm('Are you sure you wish to delete this transaction? This cannot be undone.');
	
		if (confirmDelete) {
			fetch(`/api/controllers/transactions/delete`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({rowToDelete})
			}).then(res => {
				if (res.ok) {
					const transactionsListCopy = transactionsList.filter(row => row.trn_id !== rowToDelete.trn_id);
	
					setTransactionsList(transactionsListCopy);
					alert('Success!');
				} else {
					alert('An error occurred. Please try again.');
				}
			});
		}
	};

	const handleStartEditing = row => {
		setIsEditing(true);
		setTransactionBeingEdited(row);
	};

	const handleCancel = cancelledRow => {
		const transactionsListCopy = transactionsList.map(row =>
			row.trn_id === cancelledRow.trn_id ? cancelledRow : row
		);

		setTransactionsList(transactionsListCopy);
		setIsEditing(false);
	};

	const handleSave = async (editedRowInCents, originalRow) => {
		const res = await fetch(
			`/api/controllers/transactions/edit`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					editedRow: editedRowInCents,
					originalRow,
					pageDetails: {
						type,
						account
					}
				})
			}
		);
		const newData = await res.json();

		if (newData) {
			setTransactionsList(newData);
		} else {
			alert('An error occurred. Please try again.');
		}

		setIsEditing(false);
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
						<EditableRow
							key={row.transactionId}
							index={index}
							row={row}
							remove={handleDelete}
							edit={handleStartEditing}
							cancel={handleCancel}
							save={handleSave}
							isEditing={isEditing}
							idBeingEdited={transactionBeingEdited}
							accounts={data.accounts}
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
