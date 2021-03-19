import React from 'react';

import {StyledNumberFormat} from '../styles';

const AmountSelector = props => {
	const {field, form} = props;
	const {value, name} = field;
	const {setFieldValue} = form;

	return (
		<StyledNumberFormat
			name={name}
			decimalScale={2}
			allowNegative={false}
			thousandSeparator={','}
			decimalSeparator={'.'}
			prefix={'$'}
			value={value}
			onValueChange={(val) => setFieldValue(name, val.floatValue)}
		/>
	);
};

export default AmountSelector;
