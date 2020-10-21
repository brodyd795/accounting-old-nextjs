import React from 'react';
import fetch from 'isomorphic-unfetch';

import withAuth from '../components/with-auth';
import {useFetchUser} from '../lib/user';
import Loader from '../components/loader';
import Page from '../components/layout/page';
import PageHeader from '../components/page-header';

const AdminSettings = () => {
	const {user, loading} = useFetchUser();

	const handleRebalance = async () => {
		const res = await fetch(`/api/controllers/rebalance?user=${user.email}`);

		if (res.status === 200) {
			alert('Success!');
		} else {
			alert('Something went wrong. Please try again.');
		}
	};

	return (
		<Page title='Admin Settings'>
			<PageHeader text='Admin Settings' />
			{loading && <Loader />}
			{!loading && !user && <p>No user</p>}
			{user && (
				<button type={'button'} onClick={handleRebalance}>
					Rebalance
				</button>
			)}
		</Page>
	);
};

export default withAuth(AdminSettings);
