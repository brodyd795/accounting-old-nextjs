import React from 'react';
import useSWR from 'swr';

import fetch from '../lib/fetch';
import {useFetchUser} from '../lib/user';
import Loader from '../components/loader';
import Page from '../components/layout/page';
import SummaryTable from '../components/tables/summary-table';
import PageHeader from '../components/page-header';
import Error from '../components/error';

const Index = () => {
	const {user, loading} = useFetchUser();
	const {data, error} = useSWR(
		user ? `/api/controllers?user=${user.email}` : null,
		fetch
	);
	console.log('data', data);

	if (error) return <Error />;

	return (
		<Page title='Home' loading={loading} user={user}>
			<PageHeader text='Home' />
			{!loading && !user && <p>No user</p>}
			{user && (loading || !data) && <Loader />}
			{user && data && <SummaryTable data={data} />}
		</Page>
	);
};

export default Index;
