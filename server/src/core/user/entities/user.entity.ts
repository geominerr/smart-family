import { Exclude, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({
    type: String,
    example: 'f8b506a3-d6db-4823-b4c2-015af3cf52c1',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: 'example@example.com',
  })
  email: string;

  @Exclude()
  password: string;

  @ApiProperty({
    type: String,
    example: 'john Soul',
  })
  username: string;

  @ApiProperty({
    type: String,
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479 | null',
  })
  budgetId?: string;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  version: number;

  @ApiProperty({
    type: String,
    example: 'Tue, 16 April 2024 23:50:21 GMT',
  })
  @Transform(({ value }) => value.toUTCString())
  createdAt: Date;

  @ApiProperty({
    type: String,
    example: 'Tue, 16 April 2024 23:50:21 GMT',
  })
  @Transform(({ value }) => value.toUTCString())
  updatedAt: Date;
}
