import Chance from 'chance';
import {formatDateForDb} from "../../../../lib/date-helpers";
import {calculateUpdatedBalances, formatBalancesForDb, reduceBalancesToString} from '../../../../pages/api/helpers/balance-helpers';
import {getFormattedStartOfMonthDate, getStartOfPreviousMonth} from "../../../../pages/api/helpers/date-helpers";
import {getAccountsList} from '../../../../pages/api/repositories/get-accounts-list-repository';
import {deleteAllBalances, reinsertAllBalancesNew, selectAllTransactions, selectTransactionsAfterDate, deleteBalancesAfterDate, getPreviousBalances} from "../../../../pages/api/repositories/rebalance-repository";
import {withTransactionWrapper} from "../../../../pages/api/repositories/transaction-wrapper-repository";
import {rebalanceAfterDateService} from "../../../../pages/api/services/rebalance-after-date-service";
import startOfMonth from 'date-fns/startOfMonth';

jest.mock('../../../../pages/api/repositories/transaction-wrapper-repository');
jest.mock("../../../../pages/api/repositories/rebalance-repository");
jest.mock('../../../../lib/date-helpers');
jest.mock('../../../../pages/api/helpers/date-helpers');
jest.mock('../../../../pages/api/repositories/get-accounts-list-repository');
jest.mock('../../../../pages/api/helpers/balance-helpers');
jest.mock('date-fns/startOfMonth');

const chance = new Chance();

const createRandomAccount = () => ({
    accountId: chance.d10()
});

const createRandomTransaction = () => ({
    date: chance.date(),
    fromAccountId: chance.d10(),
    toAccountId: chance.d10(),
    amount: chance.natural()
});

const createRandomBalance = () => ({
    accountId: chance.d10(),
    balance: chance.natural(),
    date: chance.date()
});

describe('rebalance-after-date-service', () => {
    let expectedDate,
        expectedStartOfMonth,
        expectedStartOfPreviousMonth;

    beforeEach(() => {
        expectedDate = chance.date();
        expectedStartOfMonth = chance.date();
        expectedStartOfPreviousMonth = chance.date();

        withTransactionWrapper.mockImplementation((fn, props) => fn(props));
        startOfMonth.mockReturnValue(expectedStartOfMonth);
        getStartOfPreviousMonth.mockReturnValue(expectedStartOfPreviousMonth);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    
    test('should call with transaction wrapper', async () => {
        await rebalanceAfterDateService({date: expectedDate});
        
        expect(withTransactionWrapper).toHaveBeenCalledTimes(1);
    });

    test('should deleteBalancesAfterDate', async () => {
        await rebalanceAfterDateService({date: expectedDate});

        expect(deleteBalancesAfterDate).toHaveBeenCalledTimes(1);
        expect(deleteBalancesAfterDate).toHaveBeenCalledWith({date: expectedDate});
    });

    test('should get all transactions after date', async () => {
        await rebalanceAfterDateService({date: expectedDate});

        expect(selectTransactionsAfterDate).toHaveBeenCalledTimes(1);
        expect(startOfMonth).toHaveBeenCalledTimes(1);
        expect(startOfMonth).toHaveBeenCalledWith(expectedDate);
        expect(selectTransactionsAfterDate).toHaveBeenCalledWith({date: expectedStartOfMonth});
    });

    test('should get previous balances', async () => {
        await rebalanceAfterDateService({date: expectedDate});

        expect(getPreviousBalances).toHaveBeenCalledTimes(1);
        expect(getStartOfPreviousMonth).toHaveBeenCalledTimes(1);
        expect(getStartOfPreviousMonth).toHaveBeenCalledWith(expectedDate);
        expect(getPreviousBalances).toHaveBeenCalledWith({date: expectedStartOfPreviousMonth});
    });
});
