import React, {useState} from 'react';
import fetch from 'isomorphic-unfetch';

import {useFetchUser} from '../../lib/user';

import EditableRow from './editable-row';
import {StyledRecentTable, StyledRecentTableWrapper} from './styles';

const RecentTable = ({data, type, account = null}) => {
	const {user} = useFetchUser();

	const [isEditing, setIsEditing] = useState(null);
	const [idBeingEdited, setIdBeingEdited] = useState(null);
	const [transactionsList, setTransactionsList] = useState(
		data.recentTransactions
	);
	console.log('transactionsList', transactionsList)
	const [showBalances, setShowBalances] = useState(false);

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

	const handleSave = async (editedRowInCents, originalRow) => {
		const res = await fetch(
			`/api/controllers/transactions/edit?user=${user.email}`,
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

	const toggleShowBalances = () => setShowBalances(!showBalances);

	return (
		<StyledRecentTableWrapper>
			<button type={'button'} onClick={toggleShowBalances}>
				Show balances
			</button>
			<StyledRecentTable>
				<thead>
					<tr key={'headings'}>
						<th>Date</th>
						<th>From</th>
						<th>To</th>
						<th>Amount</th>
						{showBalances && (
							<>
								<th>From Balance</th>
								<th>To Balance</th>
							</>
						)}
						<th>Comment</th>
						<th />
					</tr>
				</thead>
				<tbody>
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
							accounts={data.accounts}
							showBalances={showBalances}
						/>
					))}
				</tbody>
			</StyledRecentTable>
		</StyledRecentTableWrapper>
	);
};

export default RecentTable;
