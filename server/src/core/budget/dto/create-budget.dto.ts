import { ApiProperty } from '@nestjs/swagger';
import { Currency } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateBudgetDto {
  @ApiProperty({
    type: String,
    description: 'UUID v4',
    example: 'a7c1a589-7b9a-43ec-a3ef-03b90e611a5f',
  })
  @IsNotEmpty()
  @IsUUID(4)
  userId: string;

  @ApiProperty({ type: String, example: 'Family budget' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ enum: Currency })
  @IsNotEmpty()
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({ type: Number, example: 77777 })
  @IsNotEmpty()
  @IsNumber()
  goal: number;
}
