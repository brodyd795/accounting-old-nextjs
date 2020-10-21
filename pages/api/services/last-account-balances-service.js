import getLastAccountBalances from '../repositories/get-last-account-balances-repository';
import {withTransactionWrapper} from '../repositories/transaction-wrapper-repository';

const getLastAccountBalancesService = async props => {
	const {toAccount, fromAccount, id, user} = props;
	const lastAccountBalances = {};

	const {toAccountResults, fromAccountResults} = await getLastAccountBalances({
		toAccount,
		fromAccount,
		id,
		user
	});

	if (toAccountResults.length) {
		if (toAccountResults[0].to_account === toAccount) {
			lastAccountBalances.toAccount = toAccountResults[0].to_balance;
		} else {
			lastAccountBalances.toAccount = toAccountResults[0].from_balance;
		}
	} else {
		lastAccountBalances.toAccount = 0;
	}

	if (fromAccountResults.length) {
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

export default async props =>
	withTransactionWrapper(getLastAccountBalancesService, props);
