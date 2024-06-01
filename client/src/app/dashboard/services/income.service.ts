import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Income,
  IncomeCreateDto,
  IncomeUpdateDto,
} from '@app/shared/models/income.model';

@Injectable({
  providedIn: 'root',
})
export class IncomeService {
  private readonly BASE_ENDPOINT: string = 'income';

  constructor(private httpClient: HttpClient) {}

  createIncome(dto: IncomeCreateDto) {
    return this.httpClient.post<Income>(this.BASE_ENDPOINT, { ...dto });
  }

  getIncome(id: string) {
    const endpoint = `${this.BASE_ENDPOINT}/${id}`;

    return this.httpClient.get<Income>(endpoint);
  }

  updateIncome(id: string, dto: IncomeUpdateDto) {
    const endpoint = `${this.BASE_ENDPOINT}/${id}`;

    return this.httpClient.patch<Income>(endpoint, { ...dto });
  }

  deleteIncome(id: string) {
    const endpoint = `${this.BASE_ENDPOINT}/${id}`;

    return this.httpClient.delete(endpoint);
  }
}
