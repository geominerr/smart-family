import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Observable, Subscription, tap } from 'rxjs';

import { Store } from '@ngrx/store';
import { selectTransactions } from '@app/store/transactions/transactions.selectors';
import { selectCurrencyType } from '@app/store/budget/budget.selectors';

import { SelectComponent } from '@app/shared/components/select/select.component';
import { TableComponent } from '@app/shared/components/table/table.component';
import { TabsComponent } from '@app/shared/components/tabs/tabs.component';
import { TTransactionView } from '@app/shared/models/transactions.model';
import { DataTableSource } from '@app/shared/models/data-view.model';
import { CurrencyType } from '@app/shared/models/budget.model';

type TTransaction = 'income' | 'expenses';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  imports: [
    NgIf,
    AsyncPipe,
    SelectComponent,
    TableComponent,
    TabsComponent,
    MatButtonModule,
  ],
})
export class TransactionsComponent implements OnInit, OnDestroy {
  subscription: Subscription | undefined;

  currency$: Observable<CurrencyType | undefined> | undefined;

  dataTableSource: DataTableSource[] | undefined;

  dataset: TTransactionView[] | undefined;

  transactionsType: TTransaction[] = ['income', 'expenses'];

  currentPeriod: number = 0;

  constructor(private store: Store, private ref: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.currency$ = this.store.select(selectCurrencyType);
    this.subscription = this.store
      .select(selectTransactions)
      .pipe(
        tap((source) => {
          this.dataTableSource = source;

          this.setDataset();
          this.ref.markForCheck();
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  changeTab(types: TTransaction[]) {
    this.transactionsType = types;

    this.setDataset();
  }

  changePeriod(period: number): void {
    this.currentPeriod = period;

    this.setDataset();
  }

  private setDataset(): void {
    if (this.dataTableSource) {
      this.dataset = this.transactionsType
        .flatMap((type) => [
          ...(this.dataTableSource?.[this.currentPeriod]?.[type] || []),
        ])
        .sort((a, b) => (a.date > b.date ? -1 : 1));
    }
  }
}
