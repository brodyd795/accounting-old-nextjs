import React from 'react';

import {selectStyles, StyledSelect} from '../styles';

const FromAccountSelector = props => {
	const {accounts, setEditedRow, editedRow} = props;

	const handleFromAccountEdit = e => {
		if (e.value === editedRow.to_account?.value) {
			alert("The 'from' and 'to' accounts must be different.");
		} else {
			setEditedRow({
				...editedRow,
				from_account: e
			});
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
