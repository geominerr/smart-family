import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  Budget,
  BudgetCreateDto,
  BudgetDemoCreateDto,
  BudgetUpdateDto,
} from '@app/shared/models/budget.model';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private readonly BASE_ENDPOINT: string = 'budget';

  constructor(private httpClient: HttpClient) {}

  createBudget(dto: BudgetCreateDto) {
    return this.httpClient.post<Budget>(this.BASE_ENDPOINT, { ...dto });
  }

  createDemoBudget(dto: BudgetDemoCreateDto) {
    const endpoint = `${this.BASE_ENDPOINT}/demo`;

    return this.httpClient.post<Budget>(endpoint, { ...dto });
  }

  getBudget(id: string) {
    const endpoint = `${this.BASE_ENDPOINT}/${id}`;

    return this.httpClient.get<Budget>(endpoint);
  }

  updateBudget(id: string, dto: BudgetUpdateDto) {
    const endpoint = `${this.BASE_ENDPOINT}/${id}`;

    return this.httpClient.patch<Budget>(endpoint, { ...dto });
  }

  deleteBudget(id: string) {
    const endpoint = `${this.BASE_ENDPOINT}/${id}`;

    return this.httpClient.delete(endpoint);
  }
}
