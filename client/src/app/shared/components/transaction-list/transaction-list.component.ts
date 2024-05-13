import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CurrencyPipe, DatePipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

import { TabsComponent } from '@app/shared/components/tabs/tabs.component';
import {
  TTransactionCategory,
  TTransactionView,
} from '@app/shared/models/transactions.model';
import { CurrencyType } from '@app/shared/models/budget.model';
import { CategoryIconMapperService } from '@app/shared/services/category-icon-mapper.service';
import { DataTableSource } from '@app/shared/models/data-view.model';

type TTransaction = 'income' | 'expenses';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
  imports: [
    NgIf,
    NgFor,
    DatePipe,
    TitleCasePipe,
    CurrencyPipe,
    TabsComponent,
    MatListModule,
    MatIconModule,
  ],
})
export class TransactionListComponent implements OnInit, OnChanges {
  @Input() dataListSource: DataTableSource | undefined | null;

  @Input() currencyType: CurrencyType | undefined;

  dataset: TTransactionView[] | undefined;

  transactionsType: TTransaction[] = ['income', 'expenses'];

  constructor(private iconService: CategoryIconMapperService) {}

  ngOnInit(): void {
    this.setDataset();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataListSource']) {
      this.setDataset();
    }
  }

  getIconName(category: TTransactionCategory): string {
    return this.iconService.getIconNameByCategory(category);
  }

  changeTab(types: TTransaction[]): void {
    this.transactionsType = types;

    this.setDataset();
  }

  setDataset() {
    if (this.dataListSource) {
      this.dataset = this.transactionsType
        .flatMap((type) => [...(this.dataListSource?.[type] || [])])
        .sort((a, b) => (a.date > b.date ? -1 : 1));
    }
  }
}
