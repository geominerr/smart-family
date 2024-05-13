import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, filter, map } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver } from '@angular/cdk/layout';

import { Store } from '@ngrx/store';
import { UserState } from '@app/store/user/user.reducer';
import { selectUser } from '@app/store/user/user.selectors';
import { selectLastMonthTransactions } from '@app/store/transactions/transactions.selectors';
import {
  selectExpensesConvertedToDataChartSource,
  selectLastMonthExpenses,
} from '@app/store/expenses/expenses.selectors';

import { TransactionListComponent } from '@app/shared/components/transaction-list/transaction-list.component';
import { ChartBarComponent } from '@app/shared/components/chart-bar/chart-bar.component';
import { BreakdownMiniComponent } from '@app/shared/components/breakdown-mini/breakdown-mini.component';
import { CreateBudgetComponent } from '@app/dashboard/components/create-budget/create-budget.component';
import {
  DataChartSource,
  DataTableSource,
} from '@app/shared/models/data-view.model';
import { CategoryData } from '@app/shared/models/data-category.model';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  imports: [
    NgIf,
    NgFor,
    NgClass,
    AsyncPipe,
    RouterModule,
    MatButtonModule,
    ChartBarComponent,
    BreakdownMiniComponent,
    TransactionListComponent,
    CreateBudgetComponent,
  ],
})
export class OverviewComponent implements OnInit {
  user$: Observable<UserState> | undefined;

  listSource$: Observable<DataTableSource> | undefined;

  chartSourse$: Observable<DataChartSource[]> | undefined;

  categorySource$: Observable<CategoryData[]> | undefined;

  isDesktop$: Observable<boolean> | undefined;

  isTablet$: Observable<boolean> | undefined;

  isMobile$: Observable<boolean> | undefined;

  breakpoints = {
    desktop: '(max-width: 1220px)',
    tablet: '(max-width: 770px)',
    mobile: '(max-width: 500px)',
  };

  constructor(
    private store: Store,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.user$ = this.store.select(selectUser);

    this.listSource$ = this.store.select(selectLastMonthTransactions);

    this.chartSourse$ = this.store.select(
      selectExpensesConvertedToDataChartSource
    );

    this.categorySource$ = this.store
      .select(selectLastMonthExpenses)
      .pipe(filter((source) => !!source?.length));

    this.isDesktop$ = this.breakpointObserver
      .observe(this.breakpoints.desktop)
      .pipe(map((state) => state.matches));

    this.isTablet$ = this.breakpointObserver
      .observe(this.breakpoints.tablet)
      .pipe(map((state) => state.matches));

    this.isMobile$ = this.breakpointObserver
      .observe(this.breakpoints.mobile)
      .pipe(map((state) => state.matches));
  }
}
