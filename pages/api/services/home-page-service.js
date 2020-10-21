import getAllAccountBalances from '../repositories/get-all-account-balances-repository';
import getOpenAccounts from '../repositories/get-open-accounts-repository';
import {withTransactionWrapper} from '../repositories/transaction-wrapper-repository';

const summarizeAllAccountBalances = balances => {
	const categories = {
		income: {},
		expenses: {},
		assets: {},
		liabilities: {},
		virtualSavings: {}
	};
	const cleanData = {};

	Object.entries(balances).map(([key, value]) => {
		switch (key[0]) {
			case 'I':
				categories.income[key] = value;

				break;
			case 'E':
				categories.expenses[key] = value;

				break;
			case 'A':
				categories.assets[key] = value;

				break;
			case 'L':
				categories.liabilities[key] = value;

				break;
			case 'V':
				categories.virtualSavings[key] = value;

				break;
		}
	});

	Object.entries(categories).map(([category, accounts]) => {
		const cleanCategory =
			category[0].toUpperCase() + category.replace(/([A-Z])/, ' $1').slice(1);
		const categorySum = String(
			Object.values(accounts).reduce((acc, balance) => acc + balance, 0)
		);

		cleanData[cleanCategory] = {
			balance: categorySum,
			accounts: {}
		};

		Object.entries(accounts).map(([account, balance]) => {
			const cleanAccount = account.slice(2).replace(/_/g, ' ');

			cleanData[cleanCategory]['accounts'][account] = {
				name: cleanAccount,
				balance
			};
		});
	});

	return cleanData;
};

const getHomepageData = async ({user}) => {
	const balances = {};

	const accounts = await getOpenAccounts({user});

	// eslint-disable-next-line no-unused-vars
	for (const account of accounts) {
		const name = account.acc_name;
		const {lastDebit, lastCredit} = await getAllAccountBalances({
			name,
			user
		});

		// has the account had *both* debits and credits?
		if (lastDebit.length && lastCredit.length) {
			// if the most recent debit is more recent than the most recent credit
			if (lastDebit.id > lastCredit.id) {
				balances[name] = lastDebit[0]['to_balance'];
			} else {
				balances[name] = lastCredit[0]['from_balance'];
			}
			// if it's had any debits
		} else if (lastDebit.length) {
			balances[name] = lastDebit[0]['to_balance'];
			// if it's had any credits
		} else if (lastCredit.length) {
			balances[name] = lastCredit[0]['from_balance'];
			// it hasn't had any transactions before
		} else {
			balances[name] = 0;
		}
	}

	return summarizeAllAccountBalances(balances);
};

export default async props => withTransactionWrapper(getHomepageData, props);
