import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

import { NgChartsModule } from 'ng2-charts';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';

import { DataChartSource } from '@app/shared/models/data-view.model';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chart-bar',
  templateUrl: './chart-bar.component.html',
  styleUrls: ['./chart-bar.component.scss'],

  imports: [
    NgChartsModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
})
export class ChartBarComponent implements OnInit, OnChanges {
  @Input() dataSource: DataChartSource[] | undefined | null;

  @Input() periodType: 'week' | 'month' | undefined;

  @Input() currentPeriod: number = 0;

  labels = {
    week: { last: 'Last week', curr: 'Curr week' },
    month: { last: 'Last month', curr: 'Curr month' },
  };

  startData: number[] = [0, 0, 0, 0, 0, 0, 0];

  chartType: ChartType = 'bar';

  datasets: ChartDataset[] = [
    {
      data: this.startData,
      label: this.labels.week.last,
      barThickness: 17,
      backgroundColor: '#E8E8E8',
      borderRadius: {
        topLeft: 5,
        topRight: 5,
      },
    },
    {
      data: this.startData,
      label: this.labels.week.curr,
      barThickness: 17,
      backgroundColor: '#299D91',
      borderRadius: {
        topLeft: 5,
        topRight: 5,
      },
    },
  ];

  chartLabels: string[] = ['Mon', 'Thu', 'Tue', 'Wen', 'Fri', 'Sat', 'Sun'];

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          maxTicksLimit: 6,
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        align: 'end',
        labels: {
          usePointStyle: true,
          pointStyle: 'rectRounded',
          pointStyleWidth: 18,
          boxHeight: 7,
        },
      },
    },
  };

  ngOnInit(): void {
    this.setDatasets();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentPeriod'] || changes['dataSource']) {
      this.setDatasets();
    }
  }

  private setDatasets(): void {
    if (this.dataSource?.length) {
      this.datasets = [
        {
          ...this.datasets[0],
          label: this.labels?.[this.periodType || 'week']?.last,
          data:
            this.dataSource?.[this.currentPeriod + 1]?.data ||
            this.dataSource[this.currentPeriod].data.map(() => 0),
        },
        {
          ...this.datasets[1],
          label: this.labels?.[this.periodType || 'week']?.curr,
          data: [...this.dataSource[this.currentPeriod].data],
        },
      ];

      this.chartLabels = this.dataSource[this.currentPeriod].labels;
    }
  }
}
