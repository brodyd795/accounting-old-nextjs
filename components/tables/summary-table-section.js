import React from 'react';
import Link from 'next/link';

import {toDollars} from '../../lib/currency-helpers';
import {transactionCategories} from '../../enums/transaction-categories';

const SectionRow = ({account, shouldFlipSign}) =>
	<Link
		href={'/accounts/[account]'}
		as={`/accounts/${account.accountName}`}
		key={account}
	>
		<tr className={'account-row'} key={account.accountId}>
			<td className={'account'}>{account.accountName}</td>
			<td className={'balance'}>
				{toDollars(account.balance, shouldFlipSign)}
			</td>
		</tr>
	</Link>

const SummaryTableSection = ({text, data}) => {
	const categoryBalance = data.reduce((acc, curr) => acc + curr.balance, 0);
	const categoryBalanceForUI = toDollars(categoryBalance, shouldFlipSign);
	// TODO: revisit `shouldFlipSign` to see if I still want it
	const shouldFlipSign = [transactionCategories.DEBTS, transactionCategories.INCOME].includes(text);

	return (
		<>
			<tr>
				<td>{text}</td>
				<td className={'balance'}>{categoryBalanceForUI}</td>
			</tr>
			{data.map((account) => (
				<SectionRow account={account} shouldFlipSign={shouldFlipSign} />
			))}
		</>
	);
};

export default SummaryTableSection;
