import React, {useState} from 'react';
import useSWR from 'swr';
import DatePicker from 'react-datepicker';

import fetch from '../lib/fetch';
import {useFetchUser} from '../lib/user';
import Loader from '../components/loader';
import Page from '../components/layout/page';
import SummaryTable from '../components/tables/summary-table';
import PageHeader from '../components/page-header';
import Error from '../components/error';
import {getMaxDate} from '../lib/date-helpers';

const Index = () => {
	const [selectedMonth, setSelectedMonth] = useState(new Date());
	const {user, loading} = useFetchUser();
	const {data, error} = useSWR(
		user ? `/api/controllers?user=${user.email}&date=${selectedMonth}` : null,
		fetch
	);

	if (error) return <Error />;

	return (
		<Page title='Home' loading={loading} user={user}>
			<PageHeader text='Home' />
			{!loading && !user && <p>No user</p>}
			{user && (loading || !data) && <Loader />}
			{user && data && (
				<>
					<DatePicker
						selected={selectedMonth}
						onChange={date => setSelectedMonth(date)}
						dateFormat={'MMMM yyyy'}
						showMonthYearPicker
						maxDate={getMaxDate()}
					/>
					<SummaryTable data={data} />
				</>
			)}
		</Page>
	);
};

export default Index;
