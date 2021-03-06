import React from 'react';
import styled from 'styled-components';
import { transactionCategories } from '../../enums/transaction-categories';

import {StyledSummaryTable} from './styles';
import SummaryTableSection from './summary-table-section';

const StyledRow = styled.div`
	display: flex;
`;

const SummaryTable = ({data}) => {
	if (!data) {
		return null
	}
	
	return (
		<StyledRow>
			<StyledSummaryTable>
				<tbody>
					<tr>
						<th>{'Account'}</th>
						<th>{'Balance'}</th>
					</tr>
					<SummaryTableSection text={transactionCategories.INCOME} data={data[transactionCategories.INCOME]} />
					<SummaryTableSection text={transactionCategories.EXPENSES} data={data[transactionCategories.EXPENSES]} />
					<SummaryTableSection text={transactionCategories.DEBTS} data={data[transactionCategories.DEBTS]} />
					<SummaryTableSection text={transactionCategories.ASSETS} data={data[transactionCategories.ASSETS]} />
					<SummaryTableSection text={transactionCategories.VIRTUAL_SAVINGS} data={data[transactionCategories.VIRTUAL_SAVINGS]} />
				</tbody>
			</StyledSummaryTable>
		</StyledRow>
	);
};

export default SummaryTable;
