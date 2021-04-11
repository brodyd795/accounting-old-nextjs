import {startOfMonth, addMonths, subMonths} from 'date-fns';
import { formatDateForDb } from '../../../lib/date-helpers';

const toDateString = (date) => date.toISOString().slice(0, 10);

export const getDateRange = date => ({
	startDate: getStartOfSelectedMonth(date),
	endDate: getStartOfNextMonth(date)
});

export const getStartOfPreviousMonth = date => subMonths(startOfMonth(date), 1);

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
};

export const formatBalanceDate = (date) => `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}-01`;

export const getFormattedStartOfMonthDate = (date) => formatDateForDb(startOfMonth(date));
