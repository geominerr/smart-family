import { Injectable } from '@nestjs/common';

import { PrismaService } from '@app/prisma/prisma.service';

import { CreateExpenseDto } from '../dto/create-expense.dto';
import { UpdateExpenseDto } from '../dto/update-expense.dto';

@Injectable()
export class ExpenseRepository {
  constructor(private prisma: PrismaService) {}

  async createExpense(dto: CreateExpenseDto) {
    try {
      const { userId, budgetId, ...expenseData } = dto;

      const expense = await this.prisma.expense.create({
        data: {
          ...expenseData,
          User: { connect: { id: userId } },
          Budget: { connect: { id: budgetId } },
        },
      });

      return expense;
    } catch {
      null;
    }
  }

  async getExpense(id: string) {
    try {
      const expense = await this.prisma.expense.findUniqueOrThrow({
        where: { id },
      });

      return expense;
    } catch {
      return null;
    }
  }

  async updateExpense(id: string, dto: UpdateExpenseDto) {
    try {
      const expense = await this.prisma.expense.update({
        where: { id },
        data: { ...dto },
      });

      return expense;
    } catch {
      return null;
    }
  }

  async deleteExpense(id: string) {
    try {
      const expense = await this.prisma.expense.delete({
        where: { id },
      });

      return expense;
    } catch {
      return null;
    }
  }
}
