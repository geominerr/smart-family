import { ExpenseCategory } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class Expense {
  @ApiProperty({ type: String, example: 'uuid' })
  id: string;

  @ApiProperty({ type: Number, example: 100.5 })
  amount: number;

  @ApiProperty({ enum: ExpenseCategory, example: 'FOOD' })
  category: ExpenseCategory;

  @ApiProperty({ type: Date, example: '2022-04-28T12:00:00.000Z' })
  date: Date;

  @ApiProperty({
    type: String,
    example: 'Dinner with friends',
    required: false,
  })
  description?: string;

  @ApiProperty({ type: String, example: 'uuid' })
  budgetId: string;

  @ApiProperty({ type: String, example: 'uuid' })
  userId: string;
}
