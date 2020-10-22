import React from 'react';

import {selectStyles, StyledSelect} from '../styles';

const ToAccountSelector = props => {
	const {accounts, setEditedRow, editedRow} = props;

	const handleToAccountEdit = e => {
		if (e.value === editedRow.from_account.value) {
			alert("The 'from' and 'to' accounts must be different.");
		} else {
			setEditedRow({
				...editedRow,
				to_account: e
			});
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
