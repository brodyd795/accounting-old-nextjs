import DatePicker from 'react-datepicker';

const DateSelector = props => {
	const {editedRow, setEditedRow} = props;

	const handleDateEdit = date => {
		setEditedRow({
			...editedRow,
			trn_id: date
		});
	};

	return (
		<DatePicker
			selected={editedRow.trn_id}
			maxDate={new Date().setDate(new Date().getDate() + 1)}
			onChange={date => handleDateEdit(date)}
		/>
	);
};

export default DateSelector;
