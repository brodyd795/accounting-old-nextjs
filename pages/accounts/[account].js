import React from 'react';
import useSWR from 'swr';
import {useRouter} from 'next/router';

import fetch from '../../lib/fetch';
import withAuth from '../../components/with-auth';
import Loader from '../../components/loader';
import Page from '../../components/layout/page';
import PageHeader from '../../components/page-header';
import RecentTable from '../../components/tables/recent-table';
import Error from '../../components/error';
import {useFetchUser} from '../../lib/user';

const Account = () => {
	const {user, loading} = useFetchUser();
	const router = useRouter();
	const account = router.query.account;
	const {data, error} = useSWR(
		user &&
			account &&
			`/api/controllers/accounts/${account}?user=${user.email}`,
		fetch
	);

	if (error) return <Error />;

	return (
		<Page title={account}>
			<PageHeader text={account} />
			{(loading || !data) && <Loader />}
			{!loading && !user && <p>No user</p>}
			{user &&
				data &&
				(data.recentTransactions.message ? (
					JSON.stringify(data.recentTransactions.message)
				) : (
					<RecentTable data={data} type={'account'} account={account} />
				))}
		</Page>
	);
};

export default withAuth(Account);
