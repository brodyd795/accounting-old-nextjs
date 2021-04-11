import {
    calculateNewBalances,
    calculateUpdatedBalances,
    formatBalancesForDb,
    reduceBalancesToString
} from "../../../../pages/api/helpers/balance-helpers";

describe('balance-helpers', () => {
    describe('calculateNewBalances', () => {
        let expectedTransactions,
            expectedAccounts;

        beforeEach(() => {
            expectedTransactions = [
                {
                    date: new Date(2021, 1, 1),
                    fromAccountId: 1,
                    toAccountId: 2,
                    amount: 5
                },
                {
                    date: new Date(2021, 1, 13),
                    fromAccountId: 1,
                    toAccountId: 2,
                    amount: 10
                },
                {
                    date: new Date(2021, 2, 17),
                    fromAccountId: 2,
                    toAccountId: 1,
                    amount: 10
                }
            ];
            expectedAccounts = [
                {
                    accountId: 1
                },
                {
                    accountId: 2
                }
            ];
        });

        test('should return empty object if no transactions', () => {
            expectedTransactions = [];

            const result = calculateNewBalances(expectedTransactions, expectedAccounts);

            expect(result).toStrictEqual({});
        });

        test('should return updated balances', () => {
            const result = calculateNewBalances(expectedTransactions, expectedAccounts);

            expect(result).toStrictEqual({
                [new Date(2021, 1, 1)]: {
                    1: 0,
                    2: 0
                },
                [new Date(2021, 2, 1)]: {
                    1: -15,
                    2: 15
                },
                [new Date(2021, 3, 1)]: {
                    1: -5,
                    2: 5
                }
            });
        });
    });

    describe('calculateUpdatedBalances', () => {
        let expectedTransactions,
            expectedBalances;

        beforeEach(() => {
            expectedTransactions = [
                {
                    date: new Date(2021, 1, 15),
                    fromAccountId: 1,
                    toAccountId: 2,
                    amount: 5
                },
                {
                    date: new Date(2021, 1, 16),
                    fromAccountId: 1,
                    toAccountId: 2,
                    amount: 10
                },
                {
                    date: new Date(2021, 2, 1),
                    fromAccountId: 2,
                    toAccountId: 1,
                    amount: 10
                }
            ];
            expectedBalances = [];
        });

        test('should return empty object if no transactions', () => {
            expectedTransactions = [];

            const result = calculateUpdatedBalances(expectedTransactions, expectedBalances);

            expect(result).toStrictEqual({});
        });

        test('should return updated balances', () => {
            
        });
    });

    describe('formatBalancesForDb', () => {
        let expectedBalances;

        beforeEach(() => {
            expectedBalances = {
                [new Date(2021, 1, 1)]: {
                    1: 0,
                    2: 0
                },
                [new Date(2021, 2, 1)]: {
                    1: -15,
                    2: 15
                },
                [new Date(2021, 3, 1)]: {
                    1: -5,
                    2: 5
                }
            }
        });

        test('should format balances', () => {
            const expectedRows = [
                {
                    accountId: 1,
                    balance: 0,
                    date: new Date(2021, 1, 1)
                },
                {
                    accountId: 2,
                    balance: 0,
                    date: new Date(2021, 1, 1)
                },
                {
                    accountId: 1,
                    balance: -15,
                    date: new Date(2021, 2, 1)
                },
                {
                    accountId: 2,
                    balance: 15,
                    date: new Date(2021, 2, 1)
                },
                {
                    accountId: 1,
                    balance: -5,
                    date: new Date(2021, 3, 1)
                },
                {
                    accountId: 2,
                    balance: 5,
                    date: new Date(2021, 3, 1)
                }
            ];

            const actualRows = formatBalancesForDb(expectedBalances);

            expect(actualRows).toStrictEqual(expectedRows);
        });
    });

    describe('reduceBalancesToString', () => {
        let expectedBalances,
            expectedFirstDate,
            expectedSecondDate,
            expectedThirdDate;

        beforeEach(() => {
            expectedFirstDate = new Date(2021, 1, 1);
            expectedSecondDate = new Date(2021, 1, 1);
            expectedThirdDate = new Date(2021, 2, 1);

            expectedBalances = [
                {
                    accountId: 1,
                    balance: 0,
                    date: expectedFirstDate
                },
                {
                    accountId: 2,
                    balance: 0,
                    date: expectedSecondDate
                },
                {
                    accountId: 1,
                    balance: -15,
                    date: expectedThirdDate
                }
            ];
        });

       test('should reduceBalancesToString', () => {
           const expectedResult = `(1, 0, '${expectedFirstDate}'), (2, 0, '${expectedSecondDate}'), (1, -15, '${expectedThirdDate}')`;
           
           const result = reduceBalancesToString(expectedBalances);

           expect(result).toStrictEqual(expectedResult);
       }); 
    });
});