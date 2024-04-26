import { IncomeCategory } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class UpdateIncomeDto {
  @ApiProperty({ type: Number, example: 1000, required: false })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({ enum: IncomeCategory, example: 'FREELANCE', required: false })
  @IsOptional()
  @IsEnum(IncomeCategory)
  category?: IncomeCategory;

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
    example: 'Web Trade',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
