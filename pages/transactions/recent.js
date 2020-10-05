import React from 'react';
import useSWR from 'swr';

import fetch from '../../lib/fetch';
import withAuth from '../../components/with-auth';
import {useFetchUser} from '../../lib/user';
import Loader from '../../components/loader';
import Page from '../../components/layout/page';
import RecentTable from '../../components/tables/recent-table';
import PageHeader from '../../components/page-header';
import Error from '../../components/error';

const Recent = () => {
	const {user, loading} = useFetchUser();
	const {data, error} = useSWR(
		user && `/api/controllers/transactions/recent?user=${user.email}`,
		fetch
	);

	if (error) return <Error />;

	return (
		<Page title='Recent'>
			<PageHeader text='Recent' />
			{(loading || !data) && <Loader />}
			{!loading && !user && <p>No user</p>}
			{user && data && <RecentTable data={data} />}
		</Page>
	);
};

export default withAuth(Recent);
