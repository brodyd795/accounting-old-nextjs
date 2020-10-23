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
