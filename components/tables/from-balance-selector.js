import NumberFormat from 'react-number-format';

const FromBalanceSelector = props => {
	const {setEditedRow, from_balance} = props;

	const handleFromBalanceEdit = e => {
		setEditedRow(editedRow => ({
			...editedRow,
			from_balance: e.target.value.replace(/\D/g, '')
		}));
	};

	return (
		<NumberFormat
			value={from_balance}
			thousandSeparator={','}
			decimalSeparator={'.'}
			prefix={'$'}
			onBlur={handleFromBalanceEdit}
			allowNegative={false}
			decimalScale={2}
		/>
	);
};

export default FromBalanceSelector;
