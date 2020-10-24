export const toDollars = (cents, shouldFlipSign = false) => {
	const centsWithCorrectSign = shouldFlipSign ? cents * -1 : cents;

	return Math.abs(centsWithCorrectSign) >= 100000
		? String(centsWithCorrectSign).replace(
				/^(-?)(\d+(?=\d{5}))(\d{0,3})(\d{2})$/,
				'$$ $1$2,$3.$4'
		  )
		: String(centsWithCorrectSign).replace(/^(-?\d+)(\d{2})$/, '$$ $1.$2');
};

export const toCents = dollars => dollars.replace(/[$,]/g, '') * 100;
