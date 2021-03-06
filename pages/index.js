import React, {useState} from 'react';
import useSWR from 'swr';
import DatePicker from 'react-datepicker';
import styled from 'styled-components';

import fetch from '../lib/fetch';
import {useFetchUser} from '../lib/user';
import Loader from '../components/loader';
import Page from '../components/layout/page';
import SummaryTable from '../components/tables/summary-table';
import PageHeader from '../components/page-header';
import Error from '../components/error';
import {getMaxDate} from '../lib/date-helpers';
import LoginView from '../components/login-view';

const StyledDatePicker = styled(DatePicker)`
	margin-bottom: 10px;
`;

const Index = () => {
	const [selectedMonth, setSelectedMonth] = useState(new Date());
	const {user, loading} = useFetchUser();
	const {data, error} = useSWR(
		`/api/controllers?date=${selectedMonth}`,
		fetch
	);

	if (error) return <Error />;

	return (
		<Page title='Home' loading={loading} user={user}>
			<PageHeader text='Home' />
			{!loading && !user && <LoginView />}
			{user && (loading || !data) && <Loader />}
			{user && data && (
				<>
					<StyledDatePicker
						selected={selectedMonth}
						onChange={date => setSelectedMonth(date)}
						dateFormat={'MMMM yyyy'}
						showMonthYearPicker
						maxDate={getMaxDate()}
					/>
					<SummaryTable data={data.balancesByCategory} />
				</>
			)}
		</Page>
	);
};

export default Index;
