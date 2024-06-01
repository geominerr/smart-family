import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { NgClass, NgFor, TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

type TabType = 'all' | 'income' | 'expenses';
type TTransaction = 'income' | 'expenses';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  imports: [NgClass, NgFor, TitleCasePipe, MatButtonModule],
})
export class TabsComponent {
  @Output() changeTabEvent: EventEmitter<TTransaction[]> = new EventEmitter();

  tabsState: Record<TabType, boolean> = {
    all: true,
    income: false,
    expenses: false,
  };

  tabsButton: TabType[] = Object.keys(this.tabsState) as TabType[];

  toggleTab(tab: TabType) {
    this.changeTabsState(tab);
    const transactionTypes = this.getTransactionTypes();

    this.changeTabEvent.emit(transactionTypes);
  }

  private changeTabsState(tab: TabType): void {
    this.tabsState = {
      ...Object.keys(this.tabsState).reduce((acc, key) => {
        if (key === tab) {
          acc[key] = true;
        } else {
          acc[key as TabType] = false;
        }

        return acc;
      }, {} as Record<TabType, boolean>),
    };
  }

  private getTransactionTypes(): TTransaction[] {
    const activeTab = this.tabsButton.filter((tab) => this.tabsState[tab]);

    if (activeTab[0] === 'all') {
      return ['expenses', 'income'];
    }

    return activeTab as TTransaction[];
  }
}
