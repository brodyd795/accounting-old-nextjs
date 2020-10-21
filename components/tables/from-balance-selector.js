import {StyledNumberFormat} from './styles';

const FromBalanceSelector = props => {
	const {setEditedRow, from_balance} = props;

	const handleFromBalanceEdit = e => {
		const from_balance = e.target.value;
		setEditedRow(editedRow => ({
			...editedRow,
			from_balance
		}));
	};

	return (
		<StyledNumberFormat
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
