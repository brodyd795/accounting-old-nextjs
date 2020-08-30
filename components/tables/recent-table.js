import styled from "styled-components";
import EditableRow from "./editable-row";

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
				<th>Id</th>
				<th>To</th>
				<th>From</th>
				<th>Amount</th>
				<th>To Balance</th>
				<th>From Balance</th>
				<th>Comment</th>
			</tr>
			{data.map((row) => (
				<EditableRow row={row} />
			))}
		</tbody>
	</StyledTable>
);

export default RecentTable;
