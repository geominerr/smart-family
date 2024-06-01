import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import {
  NgFor,
  NgClass,
  DatePipe,
  TitleCasePipe,
  CurrencyPipe,
} from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { CategoryData } from '@app/shared/models/data-category.model';
import { TTransactionCategory } from '@app/shared/models/transactions.model';
import { CategoryIconMapperService } from '@app/shared/services/category-icon-mapper.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-breakdown',
  templateUrl: './breakdown.component.html',
  styleUrls: ['./breakdown.component.scss'],
  imports: [
    NgClass,
    NgFor,
    DatePipe,
    CurrencyPipe,
    TitleCasePipe,
    MatIconModule,
    MatButtonModule,
  ],
})
export class BreakdownComponent {
  @Input() data!: CategoryData;

  @Input() currency: string | undefined;

  @ViewChild('categoryTransactions') elementRef: ElementRef | undefined;

  hiddenScroll: boolean = true;

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
    ).toFixed(2)} %`;
  }

  converteToCoins(cents: number): string {
    return `${(cents / this.centsInCoins).toFixed(2)}`;
  }

  getMonthTrend(): boolean {
    return this.data.currSum > this.data.prevSum;
  }

  toggleHiddenScroll(): void {
    this.hiddenScroll = !this.hiddenScroll;

    if (this.elementRef?.nativeElement?.scrollTop) {
      this.elementRef.nativeElement.scrollTop = 0;
    }
  }
}
