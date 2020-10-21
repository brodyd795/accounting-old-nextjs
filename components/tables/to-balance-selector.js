import {StyledNumberFormat} from './styles';

const ToBalanceSelector = props => {
	const {setEditedRow, to_balance} = props;

	const handleToBalanceEdit = e => {
		const to_balance = e.target.value;
		setEditedRow(editedRow => ({
			...editedRow,
			to_balance
		}));
	};

	return (
		<StyledNumberFormat
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
