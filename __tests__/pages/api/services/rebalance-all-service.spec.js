import Chance from 'chance';
import {formatDateForDb} from "../../../../lib/date-helpers";
import {calculateUpdatedBalances, formatBalancesForDb, reduceBalancesToString} from '../../../../pages/api/helpers/balance-helpers';
import {getFormattedStartOfMonthDate} from "../../../../pages/api/helpers/date-helpers";
import {getAccountsList} from '../../../../pages/api/repositories/get-accounts-list-repository';
import {deleteAllBalances, reinsertAllBalancesNew, selectAllTransactions, deleteBalancesAfterDate} from "../../../../pages/api/repositories/rebalance-repository";
import {withTransactionWrapper} from "../../../../pages/api/repositories/transaction-wrapper-repository";
import {rebalanceAllService} from "../../../../pages/api/services/rebalance-all-service";

jest.mock('../../../../pages/api/repositories/transaction-wrapper-repository');
jest.mock("../../../../pages/api/repositories/rebalance-repository");
jest.mock('../../../../lib/date-helpers');
jest.mock('../../../../pages/api/helpers/date-helpers');
jest.mock('../../../../pages/api/repositories/get-accounts-list-repository');
jest.mock('../../../../pages/api/helpers/balance-helpers');

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

describe('rebalance-all-service', () => {
    let expectedAccounts,
        expectedTransactions,
        expectedBalances,
        expectedBalancesString;

    beforeEach(() => {
        expectedAccounts = chance.n(createRandomAccount, chance.d4());
        expectedTransactions = chance.n(createRandomTransaction, chance.d4());
        expectedBalances = chance.n(createRandomBalance, chance.d4());
        expectedBalancesString = chance.string();

        withTransactionWrapper.mockImplementation((fn, props) => fn(props));
        getAccountsList.mockReturnValue(expectedAccounts);
        selectAllTransactions.mockReturnValue(expectedTransactions);
        calculateUpdatedBalances.mockReturnValue(expectedBalances);
        formatBalancesForDb.mockReturnValue(expectedBalances);
        reduceBalancesToString.mockReturnValue(expectedBalancesString);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should call with transaction wrapper', async () => {
        await rebalanceAllService();

        expect(withTransactionWrapper).toHaveBeenCalledTimes(1);
    });

    test('should delete all balances', async () => {
        await rebalanceAllService();

        expect(deleteAllBalances).toHaveBeenCalledTimes(1);
    });
    
    test('should get all transactions', async () => {
        await rebalanceAllService();

        expect(selectAllTransactions).toHaveBeenCalledTimes(1);
    });
    
    test('should get all accounts', async () => {
        await rebalanceAllService();

        expect(getAccountsList).toHaveBeenCalledTimes(1);
    });
    
    test('should calculateUpdatedBalances', async () => {
        await rebalanceAllService();

        expect(calculateUpdatedBalances).toHaveBeenCalledTimes(1);
        expect(calculateUpdatedBalances).toHaveBeenCalledWith(expectedTransactions, expectedAccounts);
    });

    test('should formatBalancesForDb', async () => {
        await rebalanceAllService();

        expect(formatBalancesForDb).toHaveBeenCalledTimes(1);
        expect(formatBalancesForDb).toHaveBeenCalledWith(expectedBalances);
    });

    test('should reduceBalancesToString', async () => {
        await rebalanceAllService();

        expect(reduceBalancesToString).toHaveBeenCalledTimes(1);
        expect(reduceBalancesToString).toHaveBeenCalledWith(expectedBalances);
    });

    test('should reinsertAllBalancesNew', async () => {
        await rebalanceAllService();

        expect(reinsertAllBalancesNew).toHaveBeenCalledTimes(1);
        expect(reinsertAllBalancesNew).toHaveBeenCalledWith(expectedBalancesString);
    });
});

