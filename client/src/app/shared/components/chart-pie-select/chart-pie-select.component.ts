import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

import { DataChartSource } from '@app/shared/models/data-view.model';
import { SelectComponent } from '@app/shared/components/select/select.component';
import { ChartPieComponent } from '@app/shared/components/chart-pie/chart-pie.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chart-pie-select',
  templateUrl: './chart-pie-select.component.html',
  styleUrls: ['./chart-pie-select.component.scss'],
  imports: [NgIf, ChartPieComponent, SelectComponent],
})
export class ChartPieSelectComponent {
  @Input() chartSource: DataChartSource[] | undefined;

  @Input() chartType: 'doughnut' | 'pie' = 'doughnut';

  currPeriod: number = 0;

  updateChart(period: number) {
    this.currPeriod = period;
  }
}
