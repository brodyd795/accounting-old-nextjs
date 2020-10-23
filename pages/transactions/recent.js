import React, {useState} from 'react';
import useSWR from 'swr';
import DatePicker from 'react-datepicker';

import fetch from '../../lib/fetch';
import withAuth from '../../components/with-auth';
import {useFetchUser} from '../../lib/user';
import Loader from '../../components/loader';
import Page from '../../components/layout/page';
import RecentTable from '../../components/tables/recent-table';
import PageHeader from '../../components/page-header';
import Error from '../../components/error';
import {getMaxDate} from '../../lib/date-helpers';

const Recent = () => {
	const [selectedMonth, setSelectedMonth] = useState(new Date());
	const {user, loading} = useFetchUser();
	const {data, error} = useSWR(
		user &&
			`/api/controllers/transactions/recent?user=${user.email}&date=${selectedMonth}`,
		fetch
	);

	if (error) return <Error />;

	return (
		<Page title='Recent'>
			<PageHeader text='Recent' />
			{(loading || !data) && <Loader />}
			{!loading && !user && <p>No user</p>}
			{user && data && (
				<>
					<DatePicker
						selected={selectedMonth}
						onChange={date => setSelectedMonth(date)}
						dateFormat={'MMMM yyyy'}
						showMonthYearPicker
						maxDate={getMaxDate()}
					/>
					<RecentTable data={data} type={'recent'} />
				</>
			)}
		</Page>
	);
};

export default withAuth(Recent);
