import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';
import { selectMonthlyIncomeChartSource } from '@app/store/income/income.selectors';

import { DataChartSource } from '@app/shared/models/data-view.model';
import { ChartPieSelectComponent } from '@app/shared/components/chart-pie-select/chart-pie-select.component';
import { ChartWithSelectComponent } from '@app/shared/components/chart-with-select/chart-with-select.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
  imports: [NgIf, AsyncPipe, ChartPieSelectComponent, ChartWithSelectComponent],
})
export class IncomeComponent implements OnInit {
  chartSource$: Observable<DataChartSource[]> | undefined;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.chartSource$ = this.store.select(selectMonthlyIncomeChartSource);
  }
}
