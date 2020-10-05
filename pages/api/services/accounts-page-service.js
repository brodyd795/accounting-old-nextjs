import getAccountsList from '../repositories/get-accounts-list-repository';

import {transformAccountsListForDropdown} from './accounts-select-data-transform';

export const getAccountsPageData = async user => {
	const data = await getAccountsList({user});

	const accounts = data.map(account => account.acc_name);

	return transformAccountsListForDropdown(accounts);
};
