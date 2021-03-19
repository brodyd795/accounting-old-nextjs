import {getAccountsList} from '../repositories/get-accounts-list-repository';
import {withTransactionWrapper} from '../repositories/transaction-wrapper-repository';
import {transactionCategories} from '../../../enums/transaction-categories';

const getAccountsPageData = async () => {
	const accounts = await getAccountsList();

	const options = Object.values(transactionCategories).map((category) => ({
		label: category,
		options: accounts
			.filter((account) => account.category === category)
			.map((account) => ({
				label: account.accountName.replace(/_/g, " "),
				value: account.accountName,
				accountId: account.accountId
			}))
	}));

	return options;
};

export default async props =>
	withTransactionWrapper(getAccountsPageData, props);
