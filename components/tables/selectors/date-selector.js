import React from 'react';

import {getMaxDate} from '../../../lib/date-helpers';
import {StyledDatePicker} from '../styles';

const DateSelector = props => {
	const {editedRow, setEditedRow} = props;

	const handleDateEdit = date => {
		setEditedRow({
			...editedRow,
			trn_id: date
		});
	};

	return (
		<StyledDatePicker
			selected={editedRow.trn_id}
			maxDate={getMaxDate()}
			onChange={date => handleDateEdit(date)}
		/>
	);
};

export default DateSelector;
