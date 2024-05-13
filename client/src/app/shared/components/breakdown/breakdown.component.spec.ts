import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TTransactionCategory } from '@app/shared/models/transactions.model';
import { BreakdownComponent } from './breakdown.component';

describe('BreakdownComponent', () => {
  let component: BreakdownComponent;
  let fixture: ComponentFixture<BreakdownComponent>;
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
      imports: [BreakdownComponent],
    });
    fixture = TestBed.createComponent(BreakdownComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
