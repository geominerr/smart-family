import { TUserActions } from '@app/shared/models/user.model';
import { TBudgetActions } from '@app/shared/models/budget.model';
import { TIncomeActions } from '@app/shared/models/income.model';
import { TExpensesActions } from '@app/shared/models/expense.model';

export type TActions =
  | TUserActions
  | TBudgetActions
  | TIncomeActions
  | TExpensesActions;
