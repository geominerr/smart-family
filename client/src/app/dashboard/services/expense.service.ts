import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Expense,
  ExpenseCreateDto,
  ExpenseUpdateDto,
} from '@app/shared/models/expense.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private readonly BASE_ENDPOINT: string = 'expense';

  constructor(private httpClient: HttpClient) {}

  createExpense(dto: ExpenseCreateDto) {
    return this.httpClient.post<Expense>(this.BASE_ENDPOINT, { ...dto });
  }

  getExpense(id: string) {
    const endpoint = `${this.BASE_ENDPOINT}/${id}`;

    return this.httpClient.get<Expense>(endpoint);
  }

  updateExpense(id: string, dto: ExpenseUpdateDto) {
    const endpoint = `${this.BASE_ENDPOINT}/${id}`;

    return this.httpClient.patch<Expense>(endpoint, { ...dto });
  }

  deleteExpense(id: string) {
    const endpoint = `${this.BASE_ENDPOINT}/${id}`;

    return this.httpClient.delete(endpoint);
  }
}
