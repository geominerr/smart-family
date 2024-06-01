import { Injectable } from '@nestjs/common';

import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseRepository } from './repository/expense.repository';
import {
  ExpenseCreationException,
  ExpenseNotFoundException,
  InsufficientPermissionsException,
} from './exceptions/http.exception';

@Injectable()
export class ExpenseService {
  constructor(private expenseRepository: ExpenseRepository) {}

  async create(dto: CreateExpenseDto, sub: string) {
    if (sub !== dto.userId) {
      throw new InsufficientPermissionsException();
    }

    const expense = await this.expenseRepository.createExpense(dto);

    if (!expense) {
      throw new ExpenseCreationException();
    }

    return expense;
  }

  async findOne(id: string, sub: string) {
    const expense = await this.getExpenseOrException(id, sub);

    return expense;
  }

  async update(id: string, dto: UpdateExpenseDto, sub: string) {
    await this.getExpenseOrException(id, sub);
    const expense = await this.expenseRepository.updateExpense(id, dto);

    return expense;
  }

  async remove(id: string, sub: string) {
    await this.getExpenseOrException(id, sub);
    await this.expenseRepository.deleteExpense(id);

    return;
  }

  private async getExpenseOrException(id: string, sub: string) {
    const expense = await this.expenseRepository.getExpense(id);

    if (!expense) {
      throw new ExpenseNotFoundException();
    }

    if (sub !== expense.userId) {
      throw new InsufficientPermissionsException();
    }

    return expense;
  }
}
