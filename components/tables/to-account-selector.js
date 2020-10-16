import Select from 'react-select';
import styled from 'styled-components';

import selectStyles from './account-select-styles';

const StyledSelect = styled(Select)`
	width: 200px;
	color: black;
	text-align: left;
`;

const ToAccountSelector = props => {
	const {accounts, setEditedRow, editedRow} = props;

	const handleToAccountEdit = e => {
		if (e.value === editedRow.from_account.value) {
			alert("The 'from' and 'to' accounts must be different.");
		} else {
			setEditedRow(editedRow => ({
				...editedRow,
				to_account: e
			}));
		}
	};

	return (
		<StyledSelect
			options={accounts}
			onChange={handleToAccountEdit}
			styles={selectStyles}
			value={editedRow.to_account}
		/>
	);
};

export default ToAccountSelector;
