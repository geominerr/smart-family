import { TTransaction } from '@app/shared/models/transactions.model';
import { groupByWeekWithDailySums } from './group-by-week.util';

describe('groupByWeekWithDailySums', () => {
  const transactions: TTransaction[] = [
    {
      id: '1',
      budgetId: '1',
      userId: '1',
      date: '2024-05-13',
      amount: 1000,
      category: 'FOOD',
    },
    {
      id: '2',
      budgetId: '1',
      userId: '1',
      date: '2024-05-14',
      amount: 2000,
      category: 'HEALTHCARE',
    },
    {
      id: '3',
      budgetId: '1',
      userId: '1',
      date: '2024-04-30',
      amount: 3000,
      category: 'TRANSPORTATION',
    },
    {
      id: '4',
      budgetId: '1',
      userId: '1',
      date: '2024-05-02',
      amount: 1500,
      category: 'TRANSPORTATION',
    },
    {
      id: '4',
      budgetId: '1',
      userId: '1',
      date: '2024-03-02',
      amount: 1500,
      category: 'TRANSPORTATION',
    },
    {
      id: '4',
      budgetId: '1',
      userId: '1',
      date: '2024-03-01',
      amount: 1500,
      category: 'TRANSPORTATION',
    },
  ];

  it('should correctly group by week', () => {
    const equalAmountWeek = 12;
    const result = groupByWeekWithDailySums(transactions);
    expect(result.length).toBe(equalAmountWeek);
  });

  it('should correctly group by day', () => {
    const firstDayCurrWeek = '13 Mon';
    const result = groupByWeekWithDailySums(transactions);
    const currentWeek = result[0];

    expect(currentWeek.labels[0]).toBe(firstDayCurrWeek);
  });

  it('should converted cents to coins', () => {
    const expensesModay = 10;
    const expensesTuesday = 20;

    const result = groupByWeekWithDailySums(transactions);
    const currentWeek = result[0];

    expect(currentWeek.data[0]).toBe(expensesModay);
    expect(currentWeek.data[1]).toBe(expensesTuesday);
  });

  it('should correctly indicate the period in transition weeks', () => {
    const monday = '29 Mon';
    const wednesday = '1 Wen';
    const sunday = '5 Sun';

    const result = groupByWeekWithDailySums(transactions);
    const currentWeek = result[2];

    expect(currentWeek.labels[0]).toBe(monday);
    expect(currentWeek.labels[2]).toBe(wednesday);
    expect(currentWeek.labels[6]).toBe(sunday);
  });
});
