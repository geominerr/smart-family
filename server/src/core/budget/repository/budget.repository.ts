import { Injectable } from '@nestjs/common';

import { PrismaService } from '@app/prisma/prisma.service';

import { CreateDemoBudgetDto } from '../dto/create-demo-budget.dto';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { UpdateBudgetDto } from '../dto/update-budget.dto';
import { generateFakeTransactions } from '../demo-budget/demo-budget.utils';

@Injectable()
export class BudgetRepository {
  constructor(private prisma: PrismaService) {}

  async createDemoBudget(dto: CreateDemoBudgetDto) {
    try {
      const budget = await this.prisma.budget.create({
        data: {
          name: 'Demo budget',
          currency: dto.currency,
          goal: dto.goal,
          demo: true,
          Users: {
            connect: [{ id: dto.userId }],
          },
        },
      });

      const { expenses, incomes } = generateFakeTransactions({
        period: dto.period,
        userId: dto.userId,
        budgetId: budget.id,
        expenseRecords: dto.expensesRecords,
        incomeRecords: dto.incomeRecords,
      });

      await this.prisma.expense.createMany({ data: expenses });
      await this.prisma.income.createMany({ data: incomes });

      const updatedBudget = await this.prisma.budget.findUniqueOrThrow({
        where: { id: budget.id },
        include: {
          Incomes: true,
          Expenses: true,
        },
      });

      return updatedBudget;
    } catch (err) {
      return null;
    }
  }

  async createBudget(dto: CreateBudgetDto) {
    const { userId, ...budgetData } = dto;

    try {
      const budget = await this.prisma.budget.create({
        data: {
          ...budgetData,
          Users: {
            connect: [{ id: userId }],
          },
        },
      });

      return budget;
    } catch {
      return null;
    }
  }

  async findBudgetById(budgetId: string) {
    try {
      const budget = await this.prisma.budget.findUniqueOrThrow({
        where: { id: budgetId },
        include: {
          Incomes: true,
          Expenses: true,
        },
      });

      return budget;
    } catch {
      return null;
    }
  }

  async findBudgetByIdWithUser(budgetId: string) {
    try {
      const budget = await this.prisma.budget.findUniqueOrThrow({
        where: { id: budgetId },
        select: { Users: true },
      });

      return budget;
    } catch {
      return null;
    }
  }

  async updateBudget(id: string, dto: UpdateBudgetDto) {
    try {
      const budget = await this.prisma.budget.update({
        where: { id },
        data: { ...dto },
      });

      return budget;
    } catch {
      return null;
    }
  }

  async deleteBudget(id: string) {
    try {
      await this.prisma.$transaction([
        this.prisma.expense.deleteMany({ where: { budgetId: id } }),
        this.prisma.income.deleteMany({ where: { budgetId: id } }),
        this.prisma.user.updateMany({
          where: { budgetId: id },
          data: { budgetId: null },
        }),
        this.prisma.budget.delete({ where: { id: id } }),
      ]);
      return 'budget';
    } catch (err) {
      return null;
    }
  }
}
