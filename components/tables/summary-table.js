import styled from "styled-components";

const StyledTable = styled.table`
	border: 1px solid black;

	th,
	td {
		padding: 5px;
		text-align: center;
	}
`;

const SummaryTable = ({ data }) => (
	<StyledTable>
		<tbody>
			<tr>
				<th>Id</th>
				<th>To</th>
				<th>From</th>
				<th>Amount</th>
				<th>To Balance</th>
				<th>From Balance</th>
				<th>Comment</th>
			</tr>
			{data.map((transaction) => (
				<tr>
					{Object.values(transaction).map((cell, key) => (
						<td key={key}>{cell}</td>
					))}
				</tr>
			))}
		</tbody>
	</StyledTable>
);

export default SummaryTable;
