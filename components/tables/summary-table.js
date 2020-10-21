import React from 'react';
import Link from 'next/link';
import {toDollars} from '../../lib/dollar-cents-helpers';
import {StyledSummaryTable} from './styles';

const SummaryTable = ({data}) => (
	<StyledSummaryTable>
		<tbody>
			<tr>
				<th>Account</th>
				<th>Balance</th>
			</tr>
			{Object.entries(data).map(([category, categoryValues]) => (
				<React.Fragment key={category}>
					<tr>
						<td>{category}</td>
						<td className='balance'>{toDollars(categoryValues.balance)}</td>
					</tr>
					{Object.entries(categoryValues.accounts).map(
						([account, accountValues]) => (
							<Link href={'/accounts/[account]'} as={`/accounts/${account}`}>
								<tr className='account-row' key={account}>
									<td className='account'>{accountValues.name}</td>
									<td className='balance'>
										{toDollars(accountValues.balance)}
									</td>
								</tr>
							</Link>
						)
					)}
				</React.Fragment>
			))}
		</tbody>
	</StyledSummaryTable>
);

export default SummaryTable;
