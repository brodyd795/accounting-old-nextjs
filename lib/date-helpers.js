export const trnIdToNewDate = id => {
	const year = parseInt(String(id).replace(/(^\d{4})\d+/, '$1'));
	const month = parseInt(String(id).replace(/^\d{4}(\d{2})\d+/, '$1')) - 1;
	const day = parseInt(String(id).replace(/^\d{4}\d{2}(\d{2})\d+/, '$1'));

	return new Date(year, month, day);
};

export const getMaxDate = () => new Date().setDate(new Date().getDate());

export const dateToTrnId = date =>
	date.toISOString().replace(/^(\d{4})-(\d{2})-(\d{2}).+/, '$1$2$3');

export const formatDateForDb = (input) => {
	const date = new Date(input);

	return String(date.toISOString()).slice(0, 10)
};
