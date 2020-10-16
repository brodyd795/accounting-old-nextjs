import Select from 'react-select';
import styled from 'styled-components';

import selectStyles from './account-select-styles';

const StyledSelect = styled(Select)`
	width: 200px;
	color: black;
	text-align: left;
`;

const FromAccountSelector = props => {
	const {accounts, setEditedRow, editedRow} = props;

	const handleFromAccountEdit = e => {
		console.log('e.value', e.value);
		console.log('editedRow.to_account', editedRow.to_account);
		if (e.value === editedRow.to_account.value) {
			alert("The 'from' and 'to' accounts must be different.");
		} else {
			setEditedRow(editedRow => ({
				...editedRow,
				from_account: e
			}));
		}
	};

	return (
		<StyledSelect
			options={accounts}
			onChange={handleFromAccountEdit}
			styles={selectStyles}
			value={editedRow.from_account}
		/>
	);
};

export default FromAccountSelector;
