import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Observable, filter, map } from 'rxjs';

import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BreakpointObserver } from '@angular/cdk/layout';

import { Store } from '@ngrx/store';
import {
  selectExpensesConvertedToDataChartSource,
  selectLastMonthExpenses,
} from '@app/store/expenses/expenses.selectors';

import { ChartWithSelectComponent } from '@app/shared/components/chart-with-select/chart-with-select.component';
import { BreakdownComponent } from '@app/shared/components/breakdown/breakdown.component';
import { DataChartSource } from '@app/shared/models/data-view.model';
import { CategoryData } from '@app/shared/models/data-category.model';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
  imports: [
    NgIf,
    NgFor,
    NgClass,
    AsyncPipe,
    CurrencyPipe,
    ChartWithSelectComponent,
    BreakdownComponent,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
  ],
})
export class ExpensesComponent implements OnInit {
  private breakpoints = {
    desktop: '(max-width: 1330px)',
    mobile: '(max-width: 700px)',
  };

  isDesktop$: Observable<boolean> | undefined;

  isMobile$: Observable<boolean> | undefined;

  chartSource$: Observable<DataChartSource[]> | undefined;

  categorySourse$: Observable<CategoryData[]> | undefined;

  constructor(
    private store: Store,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.chartSource$ = this.store.select(
      selectExpensesConvertedToDataChartSource
    );

    this.categorySourse$ = this.store
      .select(selectLastMonthExpenses)
      .pipe(filter((source) => !!source?.length));

    this.isDesktop$ = this.breakpointObserver
      .observe(this.breakpoints.desktop)
      .pipe(map((state) => state.matches));

    this.isMobile$ = this.breakpointObserver
      .observe(this.breakpoints.mobile)
      .pipe(map((state) => state.matches));
  }
}
