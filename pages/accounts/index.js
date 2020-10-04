import React from 'react';
import useSWR from 'swr';
import Select from 'react-select';
import {useRouter} from 'next/router';
import styled from 'styled-components';

import withAuth from '../../components/with-auth';
import fetch from '../../lib/fetch';
import Loader from '../../components/loader';
import Page from '../../components/layout/page';
import PageHeader from '../../components/page-header';
import Error from '../../components/error';

const StyledSelect = styled(Select)`
	width: 300px;
	color: black;
`;

const Accounts = () => {
	const router = useRouter();
	const {data, error} = useSWR('/api/controllers/accounts', fetch);

	if (error) return <Error />;

	const handleChange = e => {
		router.push('/accounts/[account]', `/accounts/${e.value}`);
	};

	return (
		<Page title='Accounts'>
			<PageHeader text='Accounts' />
			{data ? (
				<StyledSelect
					options={data}
					placeholder='Select account...'
					onChange={handleChange}
				/>
			) : (
				<Loader />
			)}
		</Page>
	);
};

export default withAuth(Accounts);
