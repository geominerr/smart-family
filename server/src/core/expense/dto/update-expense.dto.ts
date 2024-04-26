import { ExpenseCategory } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class UpdateExpenseDto {
  @ApiProperty({ type: Number, example: 100.5, required: false })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({ enum: ExpenseCategory, example: 'CLOTHING', required: false })
  @IsOptional()
  @IsEnum(ExpenseCategory)
  category?: ExpenseCategory;

  @ApiProperty({
    type: Date,
    example: '2022-04-28T12:00:00.000Z',
    required: false,
  })
  @IsNotEmpty()
  @IsDateString()
  date?: Date;

  @ApiProperty({
    type: String,
    example: 'P & B',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
