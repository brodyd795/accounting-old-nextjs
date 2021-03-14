import React, {useState} from 'react';
import useSWR from 'swr';
import {useRouter} from 'next/router';
import DatePicker from 'react-datepicker';

import fetch from '../../lib/fetch';
import withAuth from '../../components/with-auth';
import Loader from '../../components/loader';
import Page from '../../components/layout/page';
import PageHeader from '../../components/page-header';
import RecentTable from '../../components/tables/recent-table';
import Error from '../../components/error';
import {useFetchUser} from '../../lib/user';
import {getMaxDate} from '../../lib/date-helpers';
import LoginView from '../../components/login-view';

const Account = () => {
	const [selectedMonth, setSelectedMonth] = useState(new Date());
	const {user, loading} = useFetchUser();
	const router = useRouter();
	const account = router.query.account;
	const {data, error} = useSWR(
		user &&
			account &&
			`/api/controllers/accounts/${account}?date=${selectedMonth}`,
		fetch
	);

	const noAccountTransactionsMessage = data && (
		<p>{JSON.stringify(data.recentTransactions.message)}</p>
	);

	if (error) return <Error />;

	return (
		<Page title={account}>
			<PageHeader text={account} />
			{(loading || !data) && <Loader />}
			{!loading && !user && <LoginView />}
			{user && data && (
				<>
					<DatePicker
						selected={selectedMonth}
						onChange={date => setSelectedMonth(date)}
						dateFormat={'MMMM yyyy'}
						showMonthYearPicker
						maxDate={getMaxDate()}
					/>
					{data.recentTransactions.message ? (
						noAccountTransactionsMessage
					) : (
						<RecentTable data={data} type={'account'} account={account} />
					)}
				</>
			)}
		</Page>
	);
};

export default withAuth(Account);
