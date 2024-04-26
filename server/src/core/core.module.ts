import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BudgetModule } from './budget/budget.module';
import { IncomeModule } from './income/income.module';
import { ExpenseModule } from './expense/expense.module';

@Module({
  imports: [AuthModule, UserModule, BudgetModule, IncomeModule, ExpenseModule],
})
export class CoreModule {}
