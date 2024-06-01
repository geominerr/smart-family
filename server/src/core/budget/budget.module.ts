import { Module } from '@nestjs/common';

import { PrismaModule } from '@app/prisma/prisma.module';
import { PrismaService } from '@app/prisma/prisma.service';

import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { BudgetRepository } from './repository/budget.repository';

@Module({
  imports: [PrismaModule],
  controllers: [BudgetController],
  providers: [BudgetService, PrismaService, BudgetRepository],
})
export class BudgetModule {}
