import {startOfMonth, addMonths} from 'date-fns';

export const getDateRange = date => ({
	startDate: getStartOfSelectedMonth(date),
	endDate: getStartOfNextMonth(date)
});

export const trnIdToNewDate = id => {
	const year = parseInt(String(id).replace(/(^\d{4})\d+/, '$1'));
	const month = parseInt(String(id).replace(/^\d{4}(\d{2})\d+/, '$1')) - 1;
	const day = parseInt(String(id).replace(/^\d{4}\d{2}(\d{2})\d+/, '$1'));

	return new Date(year, month, day);
};

const toDateString = (date) => date.toISOString().slice(0, 10);

export const getStartOfSelectedMonth = selectedMonth => {
	const dateAtStartOfMonth = startOfMonth(selectedMonth);
	const formattedLastMonth = toDateString(dateAtStartOfMonth);

	return formattedLastMonth;
};

export const getStartOfNextMonth = selectedMonth => {
	const nextMonth = addMonths(selectedMonth, 1);
	const startOfNextMonth = startOfMonth(nextMonth);
	const formattedNextMonth = toDateString(startOfNextMonth);

	return formattedNextMonth;
}
