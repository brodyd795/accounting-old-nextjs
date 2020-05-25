import styled from "styled-components";

const StyledTable = styled.table`
	border: 1px solid black;

	th,
	td {
		padding: 5px;
		text-align: center;
	}
`;

const RecentTable = ({ data }) => (
	<StyledTable>
		<tbody>
			<tr>
				<th>Account</th>
				<th>Balance</th>
			</tr>
			{Object.entries(data).map(([category, categoryValue]) => (
				<>
					<tr>
						<td>{category}</td>
						<td>{categoryValue.balance}</td>
					</tr>
					{Object.entries(categoryValue).map(([account, accountBalance]) => (
						<tr>
							<td>{account}</td>
							{/* <td>{accountBalance}</td> */}
						</tr>
					))}
				</>
			))}
		</tbody>
	</StyledTable>
);

export default RecentTable;
