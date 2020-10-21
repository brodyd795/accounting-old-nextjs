import React from 'react';

import {StyledNumberFormat} from './styles';

const ToBalanceSelector = props => {
	const {setEditedRow, value} = props;

	const handleToBalanceEdit = e => {
		const to_balance = e.target.value;

		setEditedRow(editedRow => ({
			...editedRow,
			to_balance
		}));
	};

	return (
		<StyledNumberFormat
			value={value}
			thousandSeparator={','}
			decimalSeparator={'.'}
			prefix={'$'}
			onBlur={handleToBalanceEdit}
			allowNegative={false}
			decimalScale={2}
		/>
	);
};

export default ToBalanceSelector;
