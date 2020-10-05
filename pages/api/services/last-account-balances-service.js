import {getLastAccountBalances} from '../repositories/get-last-account-balances-repository';

export const getLastAccountBalancesService = async props => {
	const {toAccount, fromAccount, id, user} = props;
	const lastAccountBalances = {};

	const {toAccountResults, fromAccountResults} = await getLastAccountBalances({
		toAccount,
		fromAccount,
		id,
		user
	});

	if (toAccountResults.length > 0) {
		if (toAccountResults[0].to_account === toAccount) {
			lastAccountBalances.toAccount = toAccountResults[0].to_balance;
		} else {
			lastAccountBalances.toAccount = toAccountResults[0].from_balance;
		}
	} else {
		lastAccountBalances.toAccount = 0;
	}

	if (fromAccountResults.length > 0) {
		if (fromAccountResults[0].to_account === fromAccount) {
			lastAccountBalances.fromAccount = fromAccountResults[0].to_balance;
		} else {
			lastAccountBalances.fromAccount = fromAccountResults[0].from_balance;
		}
	} else {
		lastAccountBalances.fromAccount = 0;
	}

	return lastAccountBalances;
};
