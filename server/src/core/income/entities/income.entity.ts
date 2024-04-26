import { ApiProperty } from '@nestjs/swagger';
import { IncomeCategory } from '@prisma/client';

export class Income {
  @ApiProperty({ type: String, example: 'uuid' })
  id: string;

  @ApiProperty({ type: Number, example: 1000 })
  amount: number;

  @ApiProperty({ enum: IncomeCategory, example: 'SALARY' })
  category: IncomeCategory;

  @ApiProperty({ type: Date, example: '2022-04-28T12:00:00.000Z' })
  date: Date;

  @ApiProperty({ type: String, example: 'Monthly salary', required: false })
  description?: string;

  @ApiProperty({ type: String, example: 'uuid' })
  budgetId: string;

  @ApiProperty({ type: String, example: 'uuid' })
  userId: string;
}
