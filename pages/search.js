import React from 'react';

import withAuth from '../components/with-auth';
import Page from '../components/layout/page';
import PageHeader from '../components/page-header';

const Search = () => (
	<Page title={'Search'}>
		<PageHeader text='Search' />
	</Page>
);

export default withAuth(Search);
