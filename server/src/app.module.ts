import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { appConfig, jwtConfig, googleConfig } from '@app/config/config.config';
import { CoreModule } from '@app/core/core.module';
import { PrismaService } from '@app/prisma/prisma.service';
import { PrismaModule } from '@app/prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@app/core/auth/guards/jwt.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [appConfig, jwtConfig, googleConfig] }),
    CoreModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
