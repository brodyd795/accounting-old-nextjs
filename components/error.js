import React from 'react';

import Page from './layout/page';
import PageHeader from './page-header';

const Error = () => {
	return (
		<Page title='Error'>
			<PageHeader text='Error' />
			<p>Oops, something went wrong!</p>
			<p>Please try reloading the page.</p>
		</Page>
	);
};

export default Error;
