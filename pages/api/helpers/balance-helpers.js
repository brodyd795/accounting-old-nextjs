import {subMonths, differenceInMonths} from 'date-fns';

import {formatBalanceDate} from './date-helpers';

export const getPreviousBalanceDate = (currentBalanceDate, previousBalanceDate) => {
    if (previousBalanceDate === undefined) {
        const monthBeforeCurrentDate = subMonths(new Date(currentBalanceDate), 1);
        const newPreviousBalanceDate = formatBalanceDate(monthBeforeCurrentDate);

        return newPreviousBalanceDate;
    }

    if (differenceInMonths(new Date(currentBalanceDate), new Date(previousBalanceDate)) > 1) {
        const newPreviousBalanceDate = formatBalanceDate(new Date(currentBalanceDate));

        return newPreviousBalanceDate;
    }

    return previousBalanceDate;
};

export const getCurrentAccountBalance = (accountId, balances, currentBalanceDate, previousBalanceDate) => {
    if (!balances[accountId]) {
        return 0;
    } else if (balances[accountId][currentBalanceDate]) {
        return balances[accountId][currentBalanceDate];
    } else if (balances[accountId][previousBalanceDate]) {
        return balances[accountId][previousBalanceDate];
    }

    return 0;
};

export const formatBalancesForDb = (balances) => {
    const rows = [];

    Object.entries(balances).forEach(([accountId, values]) => {
        Object.entries(values).forEach(([date, balance]) => {
            rows.push({
                accountId,
                balance,
                date
            });
        });
    });

    return rows;
};

export const reduceBalancesToString = (balances) =>
    balances.reduce((acc, current) => 
        `${acc}, (${current.accountId}, ${current.balance}, '${current.date}')`, '').slice(2);
