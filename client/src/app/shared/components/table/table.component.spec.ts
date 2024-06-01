import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTableHarness } from '@angular/material/table/testing';
import { TTransactionView } from '@app/shared/models/transactions.model';
import { TableComponent } from './table.component';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let loader: HarnessLoader;

  const mockTransaction: TTransactionView = {
    budgetId: 'budgetId',
    userId: 'userId',
    date: new Date().toISOString(),
    amount: 1000,
    category: 'DEBT',
    type: 'expense',
    id: 'id',
  };

  const initLengthData: number = 5;
  const initData = Array(initLengthData).fill(mockTransaction);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    component.data = initData;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create table with correct amount rows', async () => {
    const table = await loader.getHarness(MatTableHarness);
    const amountRows = (await table.getRows()).length;

    expect(amountRows).toBe(initLengthData);
  });

  it('should update the table rows when data input changed', async () => {
    const amountTransactions: number = 10;
    component.data = Array(amountTransactions).fill(mockTransaction);
    component.ngOnChanges();

    const table = await loader.getHarness(MatTableHarness);
    const amountRows = (await table.getRows()).length;

    expect(amountRows).toBe(amountTransactions);
  });
});
