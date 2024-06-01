import { GroupDataByMonth } from '@app/shared/models/data-category.model';
import {
  DataChartSource,
  DataTableSource,
} from '@app/shared/models/data-view.model';
import { TransactionsByMonth } from '@app/shared/models/transactions.model';
import { Income } from '@app/shared/models/income.model';
import { Expense } from '@app/shared/models/expense.model';
import {
  converteToChartData,
  combineMonthGroupWithType,
} from './converte-to-view-data.util';

describe('converteToChartData', () => {
  const initData: GroupDataByMonth[] = [
    {
      month: 0,
      categories: [
        {
          category: 'EDUCATION',
          currSum: 200,
          prevSum: 100,
        },
        {
          category: 'DEBT',
          currSum: 1000,
          prevSum: 500,
        },
      ],
    },
    {
      month: 1,
      categories: [
        {
          category: 'EDUCATION',
          currSum: 400,
          prevSum: 200,
        },
        {
          category: 'DEBT',
          currSum: 700,
          prevSum: 1000,
        },
      ],
    },
  ];

  const correctData: DataChartSource[] = [
    {
      period: 'February',
      data: [700, 400],
      labels: ['DEBT', 'EDUCATION'],
    },
    {
      period: 'January',
      data: [1000, 200],
      labels: ['DEBT', 'EDUCATION'],
    },
  ];

  it('should reverse the original array', () => {
    const result = converteToChartData(initData);
    const currMonth = result[0].period;
    const prevMonth = result[1].period;

    expect(currMonth).toBe(correctData[0].period);
    expect(prevMonth).toBe(correctData[1].period);
  });

  it('should sort the labels alphabetically', () => {
    const result = converteToChartData(initData);
    const correctLabels = correctData[0].labels;

    const labels = result[0].labels;

    expect(labels).toEqual(correctLabels);
  });

  it('should indicate the correct month', () => {
    const result = converteToChartData(initData);
    const correctMonth = correctData[0].period;

    const month = result[0].period;

    expect(month).toBe(correctMonth);
  });

  it('should use the current category amount', () => {
    const result = converteToChartData(initData);
    const equalData = correctData[0].data;

    const data = result[0].data;

    expect(data).toEqual(equalData);
  });
});

describe('combineMonthGroupWithType', () => {
  const incomes: TransactionsByMonth<Income> = {
    0: [
      {
        id: 'income1',
        budgetId: 'budget1',
        userId: 'user1',
        date: '2024-05-14T12:00:00Z',
        amount: 1000,
        category: 'SALARY',
        description: 'Monthly salary',
      },
    ],
    2: [
      {
        id: 'income2',
        budgetId: 'budget1',
        userId: 'user1',
        date: '2024-05-14T12:00:00Z',
        amount: 1000,
        category: 'GIFTS',
      },
    ],
  };

  const expenses: TransactionsByMonth<Expense> = {
    0: [
      {
        id: 'expense1',
        budgetId: 'budget1',
        userId: 'user1',
        date: '2024-05-14T12:00:00Z',
        amount: 1000,
        category: 'EDUCATION',
      },
    ],
    1: [
      {
        id: 'expense2',
        budgetId: 'budget1',
        userId: 'user1',
        date: '2024-05-14T12:00:00Z',
        amount: 1000,
        category: 'CLOTHING',
      },
    ],
  };

  const initData: [TransactionsByMonth<Income>, TransactionsByMonth<Expense>] =
    [{ ...incomes }, { ...expenses }];

  const convertedData: DataTableSource[] = [
    {
      period: 'March',
      income: [
        {
          id: 'income2',
          budgetId: 'budget1',
          userId: 'user1',
          date: '2024-05-14T12:00:00Z',
          amount: 10,
          category: 'GIFTS',
          type: 'income',
        },
      ],
      expenses: [],
    },
    {
      period: 'February',
      income: [],
      expenses: [
        {
          id: 'expense2',
          budgetId: 'budget1',
          userId: 'user1',
          date: '2024-05-14T12:00:00Z',
          amount: 10,
          category: 'CLOTHING',
          type: 'expense',
        },
      ],
    },
    {
      period: 'January',
      income: [
        {
          id: 'income1',
          budgetId: 'budget1',
          userId: 'user1',
          date: '2024-05-14T12:00:00Z',
          amount: 10,
          category: 'SALARY',
          description: 'Monthly salary',
          type: 'income',
        },
      ],
      expenses: [
        {
          id: 'expense1',
          budgetId: 'budget1',
          userId: 'user1',
          date: '2024-05-14T12:00:00Z',
          amount: 10,
          category: 'EDUCATION',
          type: 'expense',
        },
      ],
    },
  ];

  it('should sort by month chronologically', () => {
    const result = combineMonthGroupWithType(initData);
    const currMonth = result[0].period;
    const prevMonth = result[1].period;
    const lastMonth = result[2].period;

    expect(currMonth).toBe(convertedData[0].period);
    expect(prevMonth).toBe(convertedData[1].period);
    expect(lastMonth).toBe(convertedData[2].period);
  });

  it('should correctly distribute transactions by month and converte cents to coins', () => {
    const result = combineMonthGroupWithType(initData);
    const currMonthIncomes = result[0].income;
    const lastMonthIncomes = result[2].income;
    const lastMonthExpenses = result[2].expenses;

    expect(currMonthIncomes).toEqual(convertedData[0].income);
    expect(lastMonthIncomes).toEqual(convertedData[2].income);
    expect(lastMonthExpenses).toEqual(convertedData[2].expenses);
  });

  it('should indicate the correct month', () => {
    const result = combineMonthGroupWithType(initData);
    const currMonth = result[0].period;
    const lastMonth = result[2].period;

    expect(currMonth).toBe(convertedData[0].period);
    expect(lastMonth).toBe(convertedData[2].period);
  });
});
