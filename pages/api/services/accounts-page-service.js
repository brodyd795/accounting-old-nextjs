import { getAccountsList } from "../repositories/get-accounts-list-repository";
import { transformAccountsListForDropdown } from "./accounts-select-data-transform";

export const getAccountsPageData = async () => {
	const data = await getAccountsList();
	const accounts = data.map((account) => account.acc_name);
	const transformedAccountsList = transformAccountsListForDropdown(accounts);
	return transformedAccountsList;
};
