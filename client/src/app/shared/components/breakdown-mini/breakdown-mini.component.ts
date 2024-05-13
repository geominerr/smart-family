import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgClass, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { CategoryData } from '@app/shared/models/data-category.model';
import { TTransactionCategory } from '@app/shared/models/transactions.model';
import { CategoryIconMapperService } from '@app/shared/services/category-icon-mapper.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-mini-breakdown',
  templateUrl: './breakdown-mini.component.html',
  styleUrls: ['./breakdown-mini.component.scss'],
  imports: [
    NgClass,
    CurrencyPipe,
    TitleCasePipe,
    RouterModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class BreakdownMiniComponent {
  @Input() data!: CategoryData;

  @Input() currency: string | undefined;

  centsInCoins: number = 100;

  constructor(private iconService: CategoryIconMapperService) {}

  getIconName(category: TTransactionCategory): string {
    return this.iconService.getIconNameByCategory(category);
  }

  getDiffInPercent(): string {
    return `${(
      ((this.data.currSum - this.data.prevSum) /
        (this.data.prevSum || this.data.currSum)) *
      100
    ).toFixed(0)}% *`;
  }

  converteToCoins(cents: number): string {
    return `${(cents / this.centsInCoins).toFixed(2)}`;
  }

  getMonthTrend(): boolean {
    return this.data.currSum - this.data.prevSum > 0;
  }
}
