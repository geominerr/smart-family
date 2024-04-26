import { Injectable } from '@nestjs/common';

import { PrismaService } from '@app/prisma/prisma.service';

import { CreateIncomeDto } from '../dto/create-income.dto';
import { UpdateIncomeDto } from '../dto/update-income.dto';

@Injectable()
export class IncomeRepository {
  constructor(private prisma: PrismaService) {}

  async createIncome(dto: CreateIncomeDto) {
    try {
      const { userId, budgetId, ...incomeData } = dto;

      const income = await this.prisma.income.create({
        data: {
          ...incomeData,
          User: { connect: { id: userId } },
          Budget: { connect: { id: budgetId } },
        },
      });

      return income;
    } catch {
      null;
    }
  }

  async getIncome(id: string) {
    try {
      const income = await this.prisma.income.findUniqueOrThrow({
        where: { id },
      });

      return income;
    } catch {
      return null;
    }
  }

  async updateIncome(id: string, dto: UpdateIncomeDto) {
    try {
      const income = await this.prisma.income.update({
        where: { id },
        data: { ...dto },
      });

      return income;
    } catch {
      return null;
    }
  }

  async deleteIncome(id: string) {
    try {
      const income = await this.prisma.income.delete({
        where: { id },
      });

      return income;
    } catch {
      return null;
    }
  }
}
