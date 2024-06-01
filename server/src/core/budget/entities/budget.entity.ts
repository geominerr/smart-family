import { Currency } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

import { Expense } from '@app/core/expense/entities/expense.entity';
import { Income } from '@app/core/income/entities/income.entity';

export class Budget {
  @ApiProperty({
    type: String,
    example: 'uuid',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'Family budget',
  })
  name: string;

  @ApiProperty({
    enum: Currency,
    example: 'UAH',
  })
  currency: Currency;

  @ApiProperty({
    type: Number,
    example: 100000,
  })
  goal: number;

  @ApiProperty({
    type: [Expense],
  })
  Expenses: Expense[];

  @ApiProperty({
    type: [Income],
  })
  Incomes: Income[];
}

export class BudgetWithoutIncomeAndExpenses extends Budget {
  @ApiProperty({
    type: [Expense],
    default: [],
  })
  Expenses: Expense[];

  @ApiProperty({
    type: [Income],
    default: [],
  })
  Incomes: Income[];
}
