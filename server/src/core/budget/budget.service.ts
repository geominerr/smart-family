import { Injectable } from '@nestjs/common';

import { BudgetRepository } from './repository/budget.repository';
import { CreateDemoBudgetDto } from './dto/create-demo-budget.dto';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import {
  BudgetNotFoundException,
  InsufficientPermissionsException,
} from './exceptions/http.exception';

@Injectable()
export class BudgetService {
  constructor(private budgetRepository: BudgetRepository) {}

  async createDemoBudget(dto: CreateDemoBudgetDto, sub: string) {
    if (dto.userId !== sub) {
      throw new InsufficientPermissionsException();
    }

    return await this.budgetRepository.createDemoBudget(dto);
  }

  async create(dto: CreateBudgetDto, sub: string) {
    if (dto.userId !== sub) {
      throw new InsufficientPermissionsException();
    }

    const budget = await this.budgetRepository.createBudget(dto);

    return budget;
  }

  async findOne(id: string, sub: string) {
    await this.getBudgetOrException(id, sub);

    const budget = await this.budgetRepository.findBudgetById(id);

    return budget;
  }

  async update(id: string, dto: UpdateBudgetDto, sub: string) {
    await this.getBudgetOrException(id, sub);

    const updatedBudget = await this.budgetRepository.updateBudget(id, dto);

    return updatedBudget;
  }

  async remove(id: string, sub: string) {
    await this.getBudgetOrException(id, sub);

    await this.budgetRepository.deleteBudget(id);

    return;
  }

  private async getBudgetOrException(id: string, sub: string) {
    const budget = await this.budgetRepository.findBudgetByIdWithUser(id);

    if (!budget) {
      throw new BudgetNotFoundException();
    }

    if (!budget?.Users?.some((user) => user.id === sub)) {
      throw new InsufficientPermissionsException();
    }

    return budget;
  }
}
