import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { DataChartSource } from '@app/shared/models/data-view.model';
import { SelectComponent } from './select.component';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;
  let loader: HarnessLoader;

  const mockDataSource: DataChartSource[] = [
    {
      period: 'may',
      data: [1, 2, 3],
      labels: ['1', '2', '3'],
    },
    {
      period: 'april',
      data: [1, 2, 3],
      labels: ['1', '2', '3'],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    component.dataSource = mockDataSource;
    component.selected = 0;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should emit selectEvent with correct value', async () => {
    const select = await loader.getHarness(MatSelectHarness);
    const spyon = jest.spyOn(component.selectEvent, 'emit');
    const emitValue = 1;
    const optionValue = mockDataSource[emitValue].period;

    await select.open();
    await select.clickOptions({ text: optionValue });

    expect(spyon).toHaveBeenCalledWith(emitValue);
  });
});
