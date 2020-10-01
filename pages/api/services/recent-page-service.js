import { checkIsAdmin } from "./check-is-admin-service";
import getAll from "../repositories/get-all-transactions-repository";

export const getRecentPageData = async (user) => {
	const isAdmin = checkIsAdmin(user);

	const data = await getAll(isAdmin);

	const dataWithoutEmail = data.map(({ user_email, ...rest }) => ({ ...rest }));

	return dataWithoutEmail;
};
