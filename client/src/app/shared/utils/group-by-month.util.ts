import { TTransaction } from '../models/transactions.model';
import {
  CategoryData,
  CategoryDataWithoutTransactions,
  GroupDataByMonth,
} from '../models/data-category.model';

type TMonthMap = Record<string, Record<string, TTransaction[]>>;
type TYearMap = Record<string, TMonthMap>;

const getLastYear = (map: TYearMap | TMonthMap): number => {
  return Object.keys(map)
    .map((key) => +key)
    .sort((a, b) => (a > b ? -1 : 1))[0];
};

const groupByYearAndMonthAndCategory = (transactions: TTransaction[]) => {
  const map: TYearMap = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const yearIndex = date.getFullYear();
    const monthIndex = date.getMonth();

    if (!map?.[yearIndex]) {
      map[yearIndex] = {};
    }

    if (!map[yearIndex]?.[monthIndex]) {
      map[yearIndex][monthIndex] = {};
    }

    if (!map[yearIndex][monthIndex]?.[transaction.category]) {
      map[yearIndex][monthIndex][transaction.category] = [];
    }

    map[yearIndex][monthIndex][transaction.category].push(transaction);
  });

  return map;
};

const groupByYearAndMonth = (transactions: TTransaction[]) => {
  const map: TMonthMap = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const yearIndex = date.getFullYear();
    const monthIndex = date.getMonth();

    if (!map?.[yearIndex]) {
      map[yearIndex] = {};
    }

    if (!map[yearIndex]?.[monthIndex]) {
      map[yearIndex][monthIndex] = [];
    }

    map[yearIndex][monthIndex].push(transaction);
  });

  return map;
};

const getLastYearMonthsMap = (transactions: TTransaction[]) => {
  const yearMap = groupByYearAndMonthAndCategory(transactions);

  return yearMap[getLastYear(yearMap)];
};

export const groupByMonthWithCategorySums = (
  transactions: TTransaction[]
): CategoryData[][] => {
  const monthMap = getLastYearMonthsMap(transactions);

  return Object.keys(monthMap).map((month) =>
    Object.keys(monthMap[month]).map(
      (category) =>
        ({
          category,
          currSum: monthMap[month][category].reduce((acc, curr) => {
            return acc + curr.amount;
          }, 0),
          prevSum:
            monthMap?.[+month - 1]?.[category]?.reduce((acc, curr) => {
              return acc + curr.amount;
            }, 0) || 0,
          transactions: monthMap[month][category].sort((a, b) => {
            return a.date > b.date ? -1 : 1;
          }),
        } as CategoryData)
    )
  );
};

export const groupByMonthWithoutTransactions = (
  transactions: TTransaction[]
): CategoryDataWithoutTransactions[][] => {
  const monthMap = getLastYearMonthsMap(transactions);

  return Object.keys(monthMap).map((month) =>
    Object.keys(monthMap[month]).map(
      (category) =>
        ({
          category,
          currSum:
            monthMap[month][category].reduce((acc, curr) => {
              return acc + curr.amount;
            }, 0) / 100,
          prevSum:
            (monthMap?.[+month - 1]?.[category]?.reduce((acc, curr) => {
              return acc + curr.amount;
            }, 0) || 0) / 100,
        } as CategoryDataWithoutTransactions)
    )
  );
};

export const getLastMonthWithCategorySums = (
  transactions: TTransaction[]
): CategoryData[] => {
  const months = groupByMonthWithCategorySums(transactions);

  return months.reverse()[0];
};

export const groupByMonthAndCategory = (
  transactions: TTransaction[]
): GroupDataByMonth[] => {
  const monthMap = getLastYearMonthsMap(transactions);

  return Object.keys(monthMap).map((month) => ({
    month: +month,
    categories: Object.keys(monthMap[month]).map(
      (category) =>
        ({
          category,
          currSum:
            monthMap[month][category].reduce((acc, curr) => {
              return acc + curr.amount;
            }, 0) / 100,
          prevSum:
            (monthMap?.[+month - 1]?.[category]?.reduce((acc, curr) => {
              return acc + curr.amount;
            }, 0) || 0) / 100,
        } as CategoryDataWithoutTransactions)
    ),
  }));
};

export const groupByMonth = <T extends TTransaction>(
  transactions: T[]
): Record<string, T[]> => {
  const yearAndMonthMap = groupByYearAndMonth(transactions);
  const lastYear = getLastYear(yearAndMonthMap);

  return yearAndMonthMap[lastYear] as Record<string, T[]>;
};
