import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';

import { NgChartsModule } from 'ng2-charts';
import { ChartDataset, ChartOptions } from 'chart.js';

import { DataChartSource } from '@app/shared/models/data-view.model';
import { CategoryColorMapperService } from '@app/shared/services/category-color-mapper.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subscription, tap } from 'rxjs';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chart-pie',
  templateUrl: './chart-pie.component.html',
  styleUrls: ['./chart-pie.component.scss'],

  imports: [NgChartsModule],
})
export class ChartPieComponent implements OnInit, OnChanges, OnDestroy {
  @Input() dataSource: DataChartSource[] | undefined;

  @Input() chartType: 'doughnut' | 'pie' = 'doughnut';

  @Input() currentPeriod: number = 0;

  subscription: Subscription | undefined;

  breakpoint: string = '(max-width: 770px)';

  startData: number[] = [0, 0, 0, 0, 0, 0, 0];

  datasets: ChartDataset[] = [
    {
      data: this.startData,
      backgroundColor: [],
      hoverOffset: 10,
    },
  ];

  chartLabels: string[] = [
    'SALARY',
    'FREELANCE',
    'INVESTMENTS',
    'BUSINESS_INCOME',
    'RENTAL_INCOME',
    'GIFTS',
    'OTHER',
  ];

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'right',
        align: 'center',
        labels: {
          usePointStyle: true,
          pointStyle: 'rectRounded',
          pointStyleWidth: 30,
          boxHeight: 12,
        },
      },
    },
  };

  constructor(
    private colorService: CategoryColorMapperService,
    private breakpointObserver: BreakpointObserver,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setDatasets();

    this.subscription = this.breakpointObserver
      .observe(this.breakpoint)
      .pipe(
        tap((state) => {
          const { chartOptions } = this;

          this.chartOptions = {
            ...chartOptions,
            plugins: {
              legend: {
                ...chartOptions.plugins?.legend,
                position: state.matches ? 'bottom' : 'right',
                align: state.matches ? 'start' : 'center',
              },
            },
          };

          this.ref.markForCheck();
        })
      )
      .subscribe();
  }

  ngOnChanges(): void {
    this.setDatasets();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private setDatasets(): void {
    this.datasets = [
      {
        ...this.datasets[0],
        backgroundColor: this.chartLabels.map((label) =>
          this.colorService.getColorByCategory(label)
        ),
      },
    ];

    if (this.dataSource?.length) {
      this.datasets = [
        {
          ...this.datasets[0],
          data: this.dataSource[this.currentPeriod].data,
          backgroundColor: this.dataSource[this.currentPeriod].labels.map(
            (category) => this.colorService.getColorByCategory(category)
          ),
        },
      ];

      this.chartLabels = this.dataSource[this.currentPeriod].labels;
    }
  }
}
