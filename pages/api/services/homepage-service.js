import { checkIsAdmin } from "./check-is-admin-service";
import { getAllAccountBalances } from "../repositories/get-all-account-balances-repository";

export const getHomepageData = async (user) => {
	const isAdmin = checkIsAdmin(user);
	return getAllAccountBalances(isAdmin);
};
