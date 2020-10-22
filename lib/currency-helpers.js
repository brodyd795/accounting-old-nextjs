export const toDollars = cents =>
	String(cents).replace(/^(-?\d+)(\d{2})$/, '$1.$2');

export const toCents = dollars => dollars.replace(/[$,]/g, '') * 100;
