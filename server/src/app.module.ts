import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { appConfig, jwtConfig, googleConfig } from '@app/config/config.config';
import { CoreModule } from '@app/core/core.module';
import { PrismaService } from '@app/prisma/prisma.service';
import { PrismaModule } from '@app/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [appConfig, jwtConfig, googleConfig] }),
    CoreModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
