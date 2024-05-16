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

  it('getDiffInPercent() should return the difference as a percentage, rounded to two digits ', () => {
    component.data.currSum = 100;
    component.data.prevSum = 30;
    const equal = '233.33 %';
    const res = component.getDiffInPercent();

    expect(res).toEqual(equal);
  });

  it('converteToCoins() should return the (amount / 100) rounded to two digits', () => {
    const amountCents = 155;
    const equal = '1.55';

    const convertedAmount = component.converteToCoins(amountCents);

    expect(convertedAmount).toEqual(equal);
  });

  it('getMonthTrend() should return true, if currSum > prevSum ', () => {
    component.data.currSum = 100;
    component.data.prevSum = 20;

    const trend = component.getMonthTrend();

    expect(trend).toBeTruthy();
  });

  it('getMonthTrend() should return false, if currSum < prevSum ', () => {
    component.data.currSum = 100;
    component.data.prevSum = 101;

    const trend = component.getMonthTrend();

    expect(trend).toBeFalsy();
  });
});
