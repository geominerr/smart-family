import { GroupDataByMonth } from '@app/shared/models/data-category.model';
import {
  TTransaction,
  TransactionsByMonth,
} from '@app/shared/models/transactions.model';
import { Income } from '@app/shared/models/income.model';
import { Expense } from '@app/shared/models/expense.model';
import {
  DataChartSource,
  DataTableSource,
} from '@app/shared/models/data-view.model';

const getMonthName = (monthIndex: number) => {
  const monthMap: Record<number, string> = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December',
  };

  return monthMap[monthIndex];
};

const transformTransactions = <T extends TTransaction, K>(
  transactions: T[],
  type: 'income' | 'expense'
): K[] => {
  if (!transactions?.length) {
    return [];
  }

  return transactions.map((transaction) => ({
    ...transaction,
    amount: transaction.amount / 100,
    type,
  })) as K[];
};

export const converteToChartData = (
  data: GroupDataByMonth[]
): DataChartSource[] => {
  return data
    .map((monthData) =>
      monthData.categories
        .sort((a, b) => {
          return a.category > b.category ? -1 : 1;
        })
        .reduce(
          (acc, curr) => {
            acc.period = getMonthName(monthData.month);
            acc.labels.push(curr.category);
            acc.data.push(curr.currSum);

            return acc;
          },
          { data: [], labels: [], period: '' } as DataChartSource
        )
    )
    .reverse();
};

export const combineMonthGroupWithType = (
  data: [TransactionsByMonth<Income>, TransactionsByMonth<Expense>]
): DataTableSource[] => {
  const [incomeMap, expensesMap] = data;
  const dataTable: DataTableSource[] = [];

  const uniqueKeys = [
    ...new Set([...Object.keys(incomeMap), ...Object.keys(expensesMap)]),
  ].sort((a, b) => (a > b ? -1 : 1));

  uniqueKeys.forEach((key) => {
    const period: DataTableSource = {
      period: getMonthName(+key),
      income: transformTransactions(incomeMap?.[key], 'income'),
      expenses: transformTransactions(expensesMap?.[key], 'expense'),
    };

    dataTable.push(period);
  });

  return dataTable;
};
