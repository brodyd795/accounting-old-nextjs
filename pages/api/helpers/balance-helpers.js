import {subMonths, differenceInMonths, eachMonthOfInterval, addMonths} from 'date-fns';
import startOfMonth from 'date-fns/startOfMonth';

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

    Object.entries(balances).forEach(([date, balancesForMonth]) => {
        Object.entries(balancesForMonth).forEach(([accountId, balance]) => {
            rows.push({
                accountId: Number(accountId),
                balance,
                date: new Date(date)
            });
        });
    });

    return rows;
};

export const reduceBalancesToString = (balances) =>
    balances.reduce((acc, current) => 
        `${acc}, (${current.accountId}, ${current.balance}, '${current.date}')`, '').slice(2);

export const calculateUpdatedBalances = (transactions = [], initialBalances = []) => {
    if (!transactions.length) {
        return {};
    }

    const firstDate = transactions[0].date;
    const monthAfterFirstDate = addMonths(firstDate, 1);
    const lastDate = transactions[transactions.length - 1].date;

    const months = eachMonthOfInterval({start: monthAfterFirstDate, end: lastDate});

    const initialBalancesObject = initialBalances.reduce((acc, curr) => ({
        ...acc,
        [curr]: {
            ...acc[curr],
            [curr.accountId]: curr.balance
        }
    }), {});
};

export const calculateNewBalances = (transactions = [], accounts) => {
    if (!transactions.length) {
        return {};
    }

    const firstDate = transactions[0].date;
    const lastDate = transactions[transactions.length - 1].date;
    const monthAfterLastDate = addMonths(lastDate, 1);

    const months = eachMonthOfInterval({start: firstDate, end: monthAfterLastDate});

    const newBalances = months.reduce((balances, month) => ({
        ...balances,
        [month]: accounts.reduce((accountsBalances, account) => ({
            ...accountsBalances,
            [account.accountId]: 0
        }), {})
    }), {});

    transactions.forEach((transaction) => {
        const currentMonthStartDate = startOfMonth(transaction.date);
        const nextMonthStartDate = startOfMonth(addMonths(transaction.date, 1));

        let previousFromBalance = 0;
        let previousToBalance = 0;

        if (newBalances[nextMonthStartDate] && newBalances[nextMonthStartDate][transaction.fromAccountId]) {
            previousFromBalance = newBalances[nextMonthStartDate][transaction.fromAccountId];
        } else if (newBalances[currentMonthStartDate] && newBalances[currentMonthStartDate][transaction.fromAccountId]) {
            previousFromBalance = newBalances[currentMonthStartDate][transaction.fromAccountId];
        }

        if (newBalances[nextMonthStartDate] && newBalances[nextMonthStartDate][transaction.toAccountId]) {
            previousToBalance = newBalances[nextMonthStartDate][transaction.toAccountId];
        } else if (newBalances[currentMonthStartDate] && newBalances[currentMonthStartDate][transaction.toAccountId]) {
            previousToBalance = newBalances[currentMonthStartDate][transaction.toAccountId];
        }

        newBalances[nextMonthStartDate] = {
            ...newBalances[nextMonthStartDate],
            [transaction.fromAccountId]: previousFromBalance - transaction.amount
        }
        newBalances[nextMonthStartDate] = {
            ...newBalances[nextMonthStartDate],
            [transaction.toAccountId]: previousToBalance + transaction.amount
        }
    });

    return newBalances;
};
