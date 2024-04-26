import { IncomeCategory } from '@prisma/client';
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

export class CreateIncomeDto {
  @ApiProperty({ type: Number, example: 100.5 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: IncomeCategory, example: 'INVESTMENTS' })
  @IsNotEmpty()
  @IsEnum(IncomeCategory)
  category: IncomeCategory;

  @ApiProperty({ type: Date, example: '2022-04-28T12:00:00.000Z' })
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @ApiProperty({
    type: String,
    example: 'Crypto',
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
