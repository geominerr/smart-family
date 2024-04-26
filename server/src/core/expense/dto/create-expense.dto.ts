import { ExpenseCategory } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
  IsDateString,
  IsUUID,
} from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({ type: Number, example: 100.5 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: ExpenseCategory, example: 'FOOD' })
  @IsNotEmpty()
  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @ApiProperty({ type: Date, example: '2022-04-28T12:00:00.000Z' })
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @ApiProperty({
    type: String,
    example: 'Dinner with friends',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: String, example: 'uuid' })
  @IsNotEmpty()
  @IsUUID(4)
  budgetId: string;

  @ApiProperty({ type: String, example: 'uuid' })
  @IsNotEmpty()
  @IsUUID(4)
  userId: string;
}
