import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import {toDollars} from '../../lib/dollar-cents-helpers';

const StyledTable = styled.table`
	border: 1px solid #333;
	margin-bottom: 50px;

	th,
	td {
		padding: 5px;
		// border: 1px solid #333;
	}

	tr:nth-child(even) {
		background-color: white;
		color: #333;
	}

	.account-row {
		cursor: pointer;
	}

	.account {
		padding-left: 30px;
		padding-right: 10px;
	}

	.balance {
		padding-left: 30px;
		padding-right: 30px;
	}
`;

const SummaryTable = ({data}) => (
	<StyledTable>
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
	</StyledTable>
);

export default SummaryTable;
