import { Injectable } from '@nestjs/common';

import { PrismaService } from '@app/prisma/prisma.service';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { UpdateBudgetDto } from '../dto/update-budget.dto';

@Injectable()
export class BudgetRepository {
  constructor(private prisma: PrismaService) {}

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
      const budget = await this.prisma.budget.delete({
        where: { id },
      });

      return budget;
    } catch {
      return null;
    }
  }
}
