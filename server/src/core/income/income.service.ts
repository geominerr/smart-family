import { Injectable } from '@nestjs/common';

import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { IncomeRepository } from './repository/income.repository';
import {
  IncomeCreationException,
  IncomeNotFoundException,
  InsufficientPermissionsException,
} from './exceptions/http.exception';

@Injectable()
export class IncomeService {
  constructor(private IncomeRepository: IncomeRepository) {}

  async create(dto: CreateIncomeDto, sub: string) {
    if (sub !== dto.userId) {
      throw new InsufficientPermissionsException();
    }

    const income = await this.IncomeRepository.createIncome(dto);

    if (!income) {
      throw new IncomeCreationException();
    }

    return income;
  }

  async findOne(id: string, sub: string) {
    const income = await this.getIncomeOrException(id, sub);

    return income;
  }

  async update(id: string, dto: UpdateIncomeDto, sub: string) {
    await this.getIncomeOrException(id, sub);
    const income = await this.IncomeRepository.updateIncome(id, dto);

    return income;
  }

  async remove(id: string, sub: string) {
    await this.getIncomeOrException(id, sub);
    await this.IncomeRepository.deleteIncome(id);

    return;
  }

  private async getIncomeOrException(id: string, sub: string) {
    const income = await this.IncomeRepository.getIncome(id);

    if (!income) {
      throw new IncomeNotFoundException();
    }

    if (sub !== income.userId) {
      throw new InsufficientPermissionsException();
    }

    return income;
  }
}
