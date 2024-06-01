import { TTransaction } from '../models/transactions.model';
import {
  groupByMonth,
  groupByMonthAndCategory,
  groupByMonthWithoutTransactions,
  groupByMonthWithCategorySums,
  getLastMonthWithCategorySums,
} from './group-by-month.util';

const transactions: TTransaction[] = [
  {
    id: '1',
    budgetId: '1',
    userId: '1',
    date: '2023-05-15', // curr month
    amount: 1000,
    category: 'FOOD',
  },
  {
    id: '2',
    budgetId: '1',
    userId: '1',
    date: '2023-05-20', // curr month
    amount: 2000,
    category: 'HEALTHCARE',
  },
  {
    id: '3',
    budgetId: '1',
    userId: '1',
    date: '2023-04-10',
    amount: 3000,
    category: 'TRANSPORTATION',
  },
  {
    id: '4',
    budgetId: '1',
    userId: '1',
    date: '2023-04-15',
    amount: 1500,
    category: 'TRANSPORTATION',
  },
  {
    id: '5',
    budgetId: '1',
    userId: '1',
    date: '2023-03-20', // last month
    amount: 500,
    category: 'EDUCATION',
  },
];

describe('groupByMonth', () => {
  it('should correctly groups transactions by the last year and month', () => {
    const result = groupByMonth(transactions);
    const amountMonth = 3;

    expect(Object.keys(result).length).toBe(amountMonth);
  });
});

describe('groupByMonthAndCategory', () => {
  it('should correctly groups transactions by category and month', () => {
    const amountCategoriesCurrMonth = 2;
    const currMonthIndex = 4;

    const result = groupByMonthAndCategory(transactions);
    const monthIndex = result[2].month;
    const categories = result[2].categories;

    expect(categories.length).toBe(amountCategoriesCurrMonth);
    expect(monthIndex).toBe(currMonthIndex);
  });
});

describe('groupByMonthWithoutTransactions', () => {
  it('should correctly groups transactions by category and month', () => {
    const amountCategoriesCurrMonth = 2;
    const amountCategoriesFirstMonth = 1;
    const firstMonthCategoryName = 'EDUCATION';

    const result = groupByMonthWithoutTransactions(transactions);

    const currMonthCategories = result[2].length;
    const firstMonthCategories = result[0].length;

    expect(currMonthCategories).toBe(amountCategoriesCurrMonth);
    expect(firstMonthCategories).toBe(amountCategoriesFirstMonth);
    expect(result[0][0].category).toBe(firstMonthCategoryName);
  });
});

describe('groupByMonthWithCategorySums', () => {
  it('should correctly groups transactions by category and month', () => {
    const equalMonthCategory = 'TRANSPORTATION';
    const sumTransporaionCategory = 4500;
    const amountTransactionsMonth = 2;
    const result = groupByMonthWithCategorySums(transactions);

    const monthCategory = result[1][0].category;
    const sumCategory = result[1][0].currSum;
    const monthTransactions = result[1][0].transactions.length;

    expect(monthCategory).toBe(equalMonthCategory);
    expect(sumCategory).toBe(sumTransporaionCategory);
    expect(monthTransactions).toBe(amountTransactionsMonth);
  });
});

describe('getLastMonthWithCategorySums', () => {
  it('should return current month categories group', () => {
    const equalAmountCategories = 2;
    const result = getLastMonthWithCategorySums(transactions);

    const amountCategories = result.length;

    expect(amountCategories).toBe(equalAmountCategories);
  });
});
