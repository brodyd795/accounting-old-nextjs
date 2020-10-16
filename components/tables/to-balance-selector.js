import NumberFormat from 'react-number-format';

const ToBalanceSelector = props => {
	const {setEditedRow, to_balance} = props;

	const handleToBalanceEdit = e => {
		setEditedRow(editedRow => ({
			...editedRow,
			to_balance: e.target.value.replace(/\D/g, '')
		}));
	};

	return (
		<NumberFormat
			value={to_balance}
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
