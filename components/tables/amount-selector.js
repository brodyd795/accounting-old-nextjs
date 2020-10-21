import {StyledNumberFormat} from './styles';

const AmountSelector = props => {
	const {value, setEditedRow} = props;

	const handleAmountEdit = e => {
		const amount = e.target.value;
		setEditedRow(editedRow => ({
			...editedRow,
			amount
		}));
	};

	return (
		<StyledNumberFormat
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
