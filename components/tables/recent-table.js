import styled from "styled-components";

const StyledTable = styled.table`
	border: 1px solid black;

	th,
	td {
		padding: 5px;
		// text-align: center;
	}
`;

const RecentTable = ({ data }) => (
	<StyledTable>
		<tbody>
			<tr>
				<th>Account</th>
				<th>Balance</th>
			</tr>
			{Object.entries(data).map(([category, categoryValues], index) => (
				<React.Fragment key={index}>
					<tr>
						<td>{category}</td>
						<td>{categoryValues.balance}</td>
					</tr>
					{Object.entries(categoryValues.accounts).map(
						([account, accountBalance], index) => (
							<tr key={index}>
								<td>{account}</td>
								<td>{accountBalance}</td>
							</tr>
						)
					)}
				</React.Fragment>
			))}
		</tbody>
	</StyledTable>
);

export default RecentTable;
