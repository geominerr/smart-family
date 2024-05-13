import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TTransactionCategory } from '@app/shared/models/transactions.model';
import { BreakdownMiniComponent } from './breakdown-mini.component';

describe('BreakdownMiniComponent', () => {
  let component: BreakdownMiniComponent;
  let fixture: ComponentFixture<BreakdownMiniComponent>;
  const mockData = {
    category: 'DEBT' as TTransactionCategory,
    currSum: 100,
    prevSum: 50,
    transactions: [
      {
        budgetId: 'budgetId',
        userId: 'userId',
        date: '2024-05-11',
        amount: 1,
        category: 'DEBT' as TTransactionCategory,
        description: 'Description',
        id: 'expenseId',
      },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BreakdownMiniComponent],
    });
    fixture = TestBed.createComponent(BreakdownMiniComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
