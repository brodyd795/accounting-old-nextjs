import React from 'react';
import Link from 'next/link';

import {toDollars} from '../../lib/currency-helpers';

const SummaryTableSection = ({text, data}) => {
	const shouldFlipSign = ['Liabilities', 'Income'].includes(text);

	return (
		<>
			<tr>
				<td>{text}</td>
				<td className='balance'>{toDollars(data.balance, shouldFlipSign)}</td>
			</tr>
			{Object.entries(data.accounts).map(([account, accountValues]) => (
				<Link
					href={'/accounts/[account]'}
					as={`/accounts/${account}`}
					key={account}>
					<tr className='account-row' key={account}>
						<td className='account'>{accountValues.name}</td>
						<td className='balance'>
							{toDollars(accountValues.balance, shouldFlipSign)}
						</td>
					</tr>
				</Link>
			))}
		</>
	);
};

export default SummaryTableSection;
