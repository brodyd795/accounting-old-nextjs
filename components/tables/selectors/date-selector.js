import React from 'react';
import {useField, useFormikContext} from 'formik';

import {getMaxDate} from '../../../lib/date-helpers';
import {StyledDatePicker} from '../styles';

const DatePickerField = ({...props}) => {
	const {setFieldValue} = useFormikContext();
	const [field] = useField(props);

	return (
		<StyledDatePicker
			{...field}
			{...props}
			selected={(field.value && new Date(field.value)) || null}
			onChange={(val) => {
				setFieldValue(field.name, val);
			}}
		/>
	);
};

export default DatePickerField;
