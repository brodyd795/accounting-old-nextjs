export const toDollars = cents => {
	return Math.abs(cents) >= 100000
		? String(cents).replace(
				/^(-?)(\d+(?=\d{5}))(\d{0,3})(\d{2})$/,
				'$$ $1$2,$3.$4'
		  )
		: String(cents).replace(/^(-?\d+)(\d{2})$/, '$$ $1.$2');
};

export const toCents = dollars => dollars.replace(/[$,]/g, '') * 100;
