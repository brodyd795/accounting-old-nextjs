import styled from 'styled-components';
import NumberFormat from 'react-number-format';
import DatePicker from 'react-datepicker';
import Select from 'react-select';

export const StyledNumberFormat = styled(NumberFormat)`
	width: 100px;
`;

export const StyledDatePicker = styled(DatePicker)`
	width: 100px;
`;

export const selectStyles = {
	control: base => ({
		...base,
		minHeight: 10
	}),
	dropdownIndicator: base => ({
		...base,
		padding: 1
	}),
	valueContainer: base => ({
		...base,
		padding: '0px 6px'
	}),
	input: base => ({
		...base,
		margin: 0,
		padding: 0
	}),
	groupHeading: base => ({
		...base,
		padding: '3px 6px'
	}),
	group: base => ({
		...base,
		padding: 0
	}),
	option: base => ({
		...base,
		padding: '3px 6px'
	})
};

export const StyledSelect = styled(Select)`
	width: 150px;
	color: black;
	text-align: left;
`;

export const StyledRecentTableWrapper = styled.div`
	overflow-x: scroll;
`;

export const StyledRecentTable = styled.table`
	border: 1px solid black;

	th,
	td {
		padding: 5px;
		text-align: center;
	}
`;

export const StyledSummaryTable = styled.table`
	border: 1px solid #333;
	margin-bottom: 50px;

	th,
	td {
		padding: 5px;
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
