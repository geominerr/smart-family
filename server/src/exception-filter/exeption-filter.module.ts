import { Module } from '@nestjs/common';
import { CustomFilter } from './custom-filter.filter';

@Module({
  providers: [CustomFilter],
  exports: [CustomFilter],
})
export class ExceptionFilterModule {}
