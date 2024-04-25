import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({
    type: String,
    example: 'OLD-PasSw0rd@',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  oldPassword: string;

  @ApiProperty({
    type: String,
    example: 'NEW-PasSw0rd@',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  newPassword: string;
}
