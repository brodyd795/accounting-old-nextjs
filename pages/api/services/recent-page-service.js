import getAll from '../repositories/get-all-transactions-repository';

import {checkIsAdmin} from './check-is-admin-service';

export const getRecentPageData = async user => {
	const isAdmin = checkIsAdmin(user);

	const data = await getAll(isAdmin);

	const dataWithoutEmail = data.map(({user_email, ...rest}) => ({...rest}));

	return dataWithoutEmail;
};
