import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateBudgetDto {
  @ApiProperty({ type: String, example: 'New Budget Name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ type: Number, example: 50000 })
  @IsOptional()
  @IsNumber()
  goal?: number;
}
