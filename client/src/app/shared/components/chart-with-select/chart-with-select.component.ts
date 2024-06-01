import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

import { ChartBarComponent } from '@app/shared/components/chart-bar/chart-bar.component';
import { SelectComponent } from '@app/shared/components/select/select.component';
import { DataChartSource } from '@app/shared/models/data-view.model';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chart-with-select',
  templateUrl: './chart-with-select.component.html',
  styleUrls: ['./chart-with-select.component.scss'],
  imports: [NgIf, ChartBarComponent, SelectComponent],
})
export class ChartWithSelectComponent {
  @Input() chartSource: DataChartSource[] | undefined;

  @Input() period: 'week' | 'month' | undefined;

  currPeriod: number = 0;

  updateChart(period: number) {
    this.currPeriod = period;
  }
}
