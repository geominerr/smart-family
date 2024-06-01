import { Module } from '@nestjs/common';

import { PrismaModule } from '@app/prisma/prisma.module';
import { PrismaService } from '@app/prisma/prisma.service';

import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';
import { IncomeRepository } from './repository/income.repository';

@Module({
  imports: [PrismaModule],
  controllers: [IncomeController],
  providers: [IncomeService, PrismaService, IncomeRepository],
})
export class IncomeModule {}
