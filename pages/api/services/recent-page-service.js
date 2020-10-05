import {wrappedGetAllAccountBalances} from '../repositories/get-all-transactions-repository';

export const getRecentPageData = async user => {
	const data = await wrappedGetAllAccountBalances({user});

	const dataWithoutEmail = data.map(({user_email, ...rest}) => ({...rest}));

	return dataWithoutEmail;
};
