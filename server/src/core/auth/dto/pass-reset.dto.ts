import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PassResetDto {
  @ApiProperty({
    type: String,
    example: 'riccardo@sun.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
