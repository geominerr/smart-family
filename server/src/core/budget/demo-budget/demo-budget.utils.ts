import { ExpenseCategory, IncomeCategory } from '@prisma/client';

interface EntryData {
  userId: string;
  budgetId: string;
  period: number;
  expenseRecords: number;
  incomeRecords: number;
}

interface Income {
  userId: string;
  budgetId: string;
  amount: number;
  date: Date;
  category: IncomeCategory;
}

interface Expense {
  userId: string;
  budgetId: string;
  amount: number;
  date: Date;
  category: ExpenseCategory;
}

const getRandomDateInPast = (period: number): Date => {
  const currentDate = new Date();
  const pastDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - period + 1,
    1,
  );

  const randomTime =
    Math.random() * (currentDate.getTime() - pastDate.getTime()) +
    pastDate.getTime();

  return new Date(randomTime);
};

const getRandomCategory = <T extends string>(map: Record<string, T>): T => {
  const values = Object.values(map);
  const randomKey =
    values[Math.floor(Math.random() * values.length)] || values[0];

  return randomKey;
};

export const generateFakeTransactions = (
  data: EntryData,
): { expenses: Expense[]; incomes: Income[] } => {
  const expenses = [];
  const incomes = [];

  for (let i = 0; i < data.expenseRecords; i += 1) {
    const category = getRandomCategory<ExpenseCategory>(ExpenseCategory);
    const date = getRandomDateInPast(data.period);
    const amount = Math.floor(Math.random() * 10000);

    expenses.push({
      category,
      date,
      amount,
      userId: data.userId,
      budgetId: data.budgetId,
    });
  }

  for (let i = 0; i < data.incomeRecords; i += 1) {
    const category = getRandomCategory<IncomeCategory>(IncomeCategory);
    const date = getRandomDateInPast(data.period);
    const amount = Math.floor(Math.random() * 100000);

    incomes.push({
      category,
      date,
      amount,
      userId: data.userId,
      budgetId: data.budgetId,
    });
  }

  return { expenses, incomes };
};
