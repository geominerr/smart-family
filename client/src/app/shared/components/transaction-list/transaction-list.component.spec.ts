import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatListHarness } from '@angular/material/list/testing';
import { DataTableSource } from '@app/shared/models/data-view.model';
import { TTransactionView } from '@app/shared/models/transactions.model';

import {
  TTransaction,
  TransactionListComponent,
} from './transaction-list.component';

describe('TransactionListComponent', () => {
  let component: TransactionListComponent;
  let fixture: ComponentFixture<TransactionListComponent>;
  let loader: HarnessLoader;

  const incomeAmount = 3;
  const expensesAmount = 5;
  const mockTransaction: TTransactionView = {
    budgetId: 'budgetId',
    userId: 'userId',
    date: new Date().toISOString(),
    amount: 1000,
    category: 'DEBT',
    type: 'expense',
    id: 'id',
  };

  const initData: DataTableSource = {
    period: 'May',
    income: Array(incomeAmount).fill({ ...mockTransaction, type: 'income' }),
    expenses: Array(expensesAmount).fill({ ...mockTransaction }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionListComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TransactionListComponent);
    component = fixture.componentInstance;
    component.dataListSource = { ...initData };
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create list with correct amount items', async () => {
    const amountTransactions = incomeAmount + expensesAmount;

    const list = await loader.getHarness(MatListHarness);
    const amountListItems = (await list.getItems()).length;

    expect(amountListItems).toBe(amountTransactions);
  });

  it('changetTab(["income"]) should update dataset correctly', () => {
    const amountTransactions = incomeAmount + expensesAmount;
    const lengthBefore = component.dataset?.length;

    expect(lengthBefore).toBe(amountTransactions);

    const incomeTab: TTransaction[] = ['income'];
    component.changeTab(incomeTab);
    const lengthAfter = component.dataset?.length;

    expect(lengthAfter).toBe(incomeAmount);
  });

  it('changetTab(["expenses"]) should update dataset correctly', () => {
    const amountTransactions = incomeAmount + expensesAmount;
    const lengthBefore = component.dataset?.length;

    expect(lengthBefore).toBe(amountTransactions);

    const expensesTab: TTransaction[] = ['expenses'];
    component.changeTab(expensesTab);
    const lengthAfter = component.dataset?.length;

    expect(lengthAfter).toBe(expensesAmount);
  });
});
