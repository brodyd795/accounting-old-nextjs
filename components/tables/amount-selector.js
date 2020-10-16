import NumberFormat from 'react-number-format';

const AmountSelector = props => {
	const {value, setEditedRow} = props;

	const handleAmountEdit = e => {
		setEditedRow(editedRow => ({
			...editedRow,
			amount: e.target.value.replace(/\D/g, '')
		}));
	};

	return (
		<NumberFormat
			value={value}
			thousandSeparator={','}
			decimalSeparator={'.'}
			prefix={'$'}
			onBlur={handleAmountEdit}
			allowNegative={false}
			decimalScale={2}
		/>
	);
};

export default AmountSelector;
