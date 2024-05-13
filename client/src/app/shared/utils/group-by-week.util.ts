import { DataChartSource } from '../models/data-view.model';
import { TTransaction } from '../models/transactions.model';

const getLastMonday = (date: string): Date => {
  const lastDate = new Date(date);
  const lastDay = lastDate.getDay();
  const lastMondaySince = lastDay === 0 ? 6 : lastDay - 1;
  const lastMonday = new Date(lastDate);

  lastMonday.setDate(lastDate.getDate() - lastMondaySince);
  lastMonday.setHours(0);
  lastMonday.setMinutes(0);
  lastMonday.setSeconds(0);
  lastMonday.setMilliseconds(0);

  return lastMonday;
};

const createDateLabel = (
  day: string,
  startDate: Date,
  next: number
): string => {
  const date = new Date(startDate);
  date.setDate(startDate.getDate() + next);

  return `${date.getDate()} ${day}`;
};

const createWeekInterval = (startDate: Date) => {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return `${start.toDateString()} -- ${end.toDateString()}`;
};

export const sortByDate = (transactions: TTransaction[]) => {
  return transactions.sort((a, b) => {
    if (a.date > b.date) {
      return -1;
    }

    return 1;
  });
};

const correctDayIndex = (index: number) => {
  return index - 1 >= 0 ? index - 1 : 6;
};

const createWeekTemplate = (startDate: Date): DataChartSource => {
  const labels = ['Mon', 'Thu', 'Tue', 'Wen', 'Fri', 'Sat', 'Sun'];

  return {
    period: createWeekInterval(startDate),
    data: Array(7).fill(0),
    labels: labels.map((day, index) => createDateLabel(day, startDate, index)),
  };
};

export const groupByWeekWithDailySums = (transactions: TTransaction[]) => {
  const sortedTransactions = sortByDate(transactions);
  const firstWeekDay = getLastMonday(sortedTransactions[0].date);

  let currentWeek = createWeekTemplate(firstWeekDay);

  const weeklyTransactions: DataChartSource[] = [currentWeek];

  sortedTransactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);

    if (transactionDate < firstWeekDay) {
      firstWeekDay.setDate(firstWeekDay.getDate() - 7);

      currentWeek = createWeekTemplate(firstWeekDay);
      weeklyTransactions.push(currentWeek);
    }

    const dayIndex = correctDayIndex(transactionDate.getDay());
    currentWeek.data[dayIndex] += transaction.amount;
  });

  return weeklyTransactions.map((week) => ({
    ...week,
    data: week.data.map((sum) => sum / 100),
  }));
};
