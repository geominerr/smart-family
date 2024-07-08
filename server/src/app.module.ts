import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';

import { appConfig, jwtConfig, googleConfig } from '@app/config/config.config';
import { CoreModule } from '@app/core/core.module';
import { JwtAuthGuard } from '@app/core/auth/guards/jwt.guard';
import { PrismaService } from '@app/prisma/prisma.service';
import { PrismaModule } from '@app/prisma/prisma.module';
import { ExceptionFilterModule } from '@app/core/exception-filter/exeption-filter.module';
import { CustomFilter } from '@app/core/exception-filter/custom-filter.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [appConfig, jwtConfig, googleConfig] }),
    CoreModule,
    PrismaModule,
    ExceptionFilterModule,
  ],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    { provide: APP_FILTER, useClass: CustomFilter },
  ],
})
export class AppModule {}
