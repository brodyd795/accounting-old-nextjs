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

const StyledFullBar = styled.div`
	max-width: 500px;
	background-color: black;
	border-radius: 13px;
	padding: 3px;
	margin-bottom: 10px;
`;

const StyledFilledPart = styled.div`
	background-color: ${props => props.myColor};
	width: ${props => `${props.percent}%`};
	height: 20px;
	border-radius: 10px;
`;

const perc2color = (percent) => {
	let r, g, b = 0;

	if (percent < 50) {
		r = 255;
		g = Math.round(5.1 * percent);
	} else {
		g = 255;
		r = Math.round(510 - 5.10 * percent);
	}

	let h = r * 0x10000 + g * 0x100 + b * 0x1;

	return '#' + ('000000' + h.toString(16)).slice(-6);
}

const Index = () => {
	const [selectedMonth, setSelectedMonth] = useState(new Date());
	const {user, loading} = useFetchUser();
	const {data, error} = useSWR(
		user ? `/api/controllers?user=${user.email}&date=${selectedMonth}` : null,
		fetch
	);
	// const progress = data?.balances.expenses.balance / data?.lastMonthsIncome * -1 * 100;
	const progress = 100;

	if (error) return <Error />;

	return (
		<Page title='Home' loading={loading} user={user}>
			<PageHeader text='Home' />
			{!loading && !user && <LoginView />}
			{user && (loading || !data) && <Loader />}
			{user && data && (
				<>
					<StyledFullBar>
						<StyledFilledPart percent={progress > 100 ? 100 : progress} myColor={perc2color(progress > 100 ? 100 : progress)}></StyledFilledPart>
					</StyledFullBar>
					<DatePicker
						selected={selectedMonth}
						onChange={date => setSelectedMonth(date)}
						dateFormat={'MMMM yyyy'}
						showMonthYearPicker
						maxDate={getMaxDate()}
					/>
					<SummaryTable data={data.balances} />
				</>
			)}
		</Page>
	);
};

export default Index;
