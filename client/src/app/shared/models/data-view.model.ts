import { ExpenseView } from '@app/shared/models/expense.model';
import { IncomeView } from '@app/shared/models/income.model';

export interface DataChartSource {
  period: string;
  data: number[];
  labels: string[];
}

export interface DataTableSource {
  period: string;
  income: IncomeView[];
  expenses: ExpenseView[];
}
