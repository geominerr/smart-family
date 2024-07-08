import { Module } from '@nestjs/common';

import { LoggingInterceptor } from './logger.interceptor';

@Module({
  providers: [LoggingInterceptor],
  exports: [LoggingInterceptor],
})
export class LoggerModule {}
