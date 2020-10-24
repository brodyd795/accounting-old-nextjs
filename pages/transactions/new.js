import React, {useState} from 'react';
import styled from 'styled-components';
import useSWR from 'swr';

import Page from '../../components/layout/page';
import Loader from '../../components/loader';
import PageHeader from '../../components/page-header';
import AmountSelector from '../../components/tables/selectors/amount-selector';
import CommentSelector from '../../components/tables/selectors/comment-selector';
import DateSelector from '../../components/tables/selectors/date-selector';
import FromAccountSelector from '../../components/tables/selectors/from-account-selector';
import ToAccountSelector from '../../components/tables/selectors/to-account-selector';
import {dateToTrnId, trnIdToNewDate} from '../../lib/date-helpers';
import {toCents} from '../../lib/currency-helpers';
import {useFetchUser} from '../../lib/user';
import withAuth from '../../components/with-auth';
import fetcher from '../../lib/fetch';
import fetch from 'isomorphic-unfetch';
import LoginView from '../../components/login-view';

const StyledSelectorWrapper = styled.div`
	margin-bottom: 10px;
	display: flex;
`;

const StyledLabel = styled.label`
	margin-right: 10px;
`;

const NewTransaction = () => {
	const {user, loading} = useFetchUser();
	const {data, error} = useSWR(
		user && `/api/controllers/accounts?user=${user.email}`,
		fetcher
	);

	const today = new Date();
	const year = today.getFullYear();
	const month = today.getMonth() + 1;
	const day = today.getDate();
	const id = parseInt(`${year}${month < 10 ? '0' : ''}${month}${day}00`);
	const date = trnIdToNewDate(id);

	const newFormData = {
		trn_id: date,
		from_account: null,
		to_account: null,
		amount: 0,
		comment: ''
	};

	const [newTransaction, setNewTransaction] = useState(newFormData);

	const handleSubmit = async e => {
		e.preventDefault();

		if (
			!newTransaction.trn_id ||
			!newTransaction.amount ||
			!newTransaction.to_account ||
			!newTransaction.from_account
		) {
			alert('Please fill out all fields to continue');
		} else {
			const res = await fetch(
				`/api/controllers/transactions/new?user=${user.email}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						newTransaction: {
							id: dateToTrnId(newTransaction.trn_id),
							toAccount: newTransaction.to_account.value,
							fromAccount: newTransaction.from_account.value,
							amount: toCents(newTransaction.amount),
							comment: newTransaction.comment
						}
					})
				}
			);
			if (res.status === 200) {
				alert('Success!');
				setNewTransaction(newFormData);
			} else {
				alert('An error occurred. Please try again.');
			}
		}
	};

	return (
		<Page title='New Transaction'>
			<PageHeader text='New Transaction' />
			{(loading || !data) && <Loader />}
			{!loading && !user && <LoginView />}
			{user && data && (
				<form onSubmit={handleSubmit}>
					<StyledSelectorWrapper>
						<StyledLabel>Date: </StyledLabel>
						<DateSelector
							setEditedRow={setNewTransaction}
							editedRow={newTransaction}
						/>
					</StyledSelectorWrapper>
					<StyledSelectorWrapper>
						<StyledLabel>From: </StyledLabel>
						<FromAccountSelector
							accounts={data}
							setEditedRow={setNewTransaction}
							editedRow={newTransaction}
						/>
					</StyledSelectorWrapper>
					<StyledSelectorWrapper>
						<StyledLabel>To: </StyledLabel>
						<ToAccountSelector
							accounts={data}
							setEditedRow={setNewTransaction}
							editedRow={newTransaction}
						/>
					</StyledSelectorWrapper>
					<StyledSelectorWrapper>
						<StyledLabel>Amount: </StyledLabel>
						<AmountSelector
							value={newTransaction.amount}
							setEditedRow={setNewTransaction}
						/>
					</StyledSelectorWrapper>
					<StyledSelectorWrapper>
						<StyledLabel>Description: </StyledLabel>
						<CommentSelector
							setEditedRow={setNewTransaction}
							value={newTransaction.comment}
						/>
					</StyledSelectorWrapper>
					<button type={'submit'}>{'Save'}</button>
					<button
						type={'button'}
						onClick={() => setNewTransaction(newFormData)}>
						{'Cancel'}
					</button>
				</form>
			)}
		</Page>
	);
};

export default withAuth(NewTransaction);
