export const getDateRange = date => {
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	const minDate = parseInt(`${year}${month < 10 ? '0' : ''}${month}0000`);
	const dateRange = {
		min: minDate,
		max: minDate + 9999
	};
	return dateRange;
};

export const trnIdToNewDate = id => {
	const year = parseInt(String(id).replace(/(^\d{4})\d+/, '$1'));
	const month = parseInt(String(id).replace(/^\d{4}(\d{2})\d+/, '$1')) - 1;
	const day = parseInt(String(id).replace(/^\d{4}\d{2}(\d{2})\d+/, '$1'));

	return new Date(year, month, day);
};
