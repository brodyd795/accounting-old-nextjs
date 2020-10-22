import React from 'react';
import styled from 'styled-components';

import {StyledSummaryTable} from './styles';
import SummaryTableSection from './summary-table-section';

const StyledRow = styled.div`
	display: flex;
`;

const SummaryTable = ({data}) => (
	<StyledRow>
		<StyledSummaryTable>
			<tbody>
				<tr>
					<th>Account</th>
					<th>Balance</th>
				</tr>
				<SummaryTableSection text={'Assets'} data={data.assets} />
				<SummaryTableSection text={'Liabilities'} data={data.liabilities} />
				<SummaryTableSection
					text={'Virtual Savings'}
					data={data.virtualSavings}
				/>
			</tbody>
		</StyledSummaryTable>
		<StyledSummaryTable>
			<tbody>
				<tr>
					<th>Account</th>
					<th>Balance</th>
				</tr>
				<SummaryTableSection text={'Income'} data={data.income} />
				<SummaryTableSection text={'Expenses'} data={data.expenses} />
			</tbody>
		</StyledSummaryTable>
	</StyledRow>
);

export default SummaryTable;
