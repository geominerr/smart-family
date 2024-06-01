import { ApiProperty } from '@nestjs/swagger';
import { Currency } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsUUID, IsNumber } from 'class-validator';

export class CreateDemoBudgetDto {
  @ApiProperty({
    type: String,
    description: 'UUID v4',
    example: 'a7c1a589-7b9a-43ec-a3ef-03b90e611a5f',
  })
  @IsNotEmpty()
  @IsUUID(4)
  userId: string;

  @ApiProperty({ enum: Currency })
  @IsNotEmpty()
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({ type: Number, example: 77777 })
  @IsNotEmpty()
  @IsNumber()
  goal: number;

  @ApiProperty({
    type: Number,
    description: 'Number of fake expense records',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  expensesRecords: number;

  @ApiProperty({
    type: Number,
    description: 'Number of fake  income records',
    example: 15,
  })
  @IsNotEmpty()
  @IsNumber()
  incomeRecords: number;

  @ApiProperty({
    type: Number,
    description: 'Number of months ago from current',
    example: 3,
  })
  @IsNotEmpty()
  @IsNumber()
  period: number;
}
