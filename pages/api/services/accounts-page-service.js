import getAccountsList from '../repositories/get-accounts-list-repository';
import {withTransactionWrapper} from '../repositories/transaction-wrapper-repository';

import transformAccountsListForDropdown from './accounts-select-data-transform';

const getAccountsPageData = async user => {
	const data = await getAccountsList(user);

	const accounts = data.map(account => account.acc_name);

	return transformAccountsListForDropdown(accounts);
};

export default async props =>
	withTransactionWrapper(getAccountsPageData, props);
