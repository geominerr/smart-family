import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CurrencyPipe, DatePipe, NgClass, NgIf, TitleCasePipe } from '@angular/common';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription, tap } from 'rxjs';

import { CategoryIconMapperService } from '../../services/category-icon-mapper.service';
import { TTransactionCategory, TTransactionView } from '../../models/transactions.model';

import { CurrencyType } from '../../models/budget.model';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  imports: [
    NgIf,
    NgClass,
    DatePipe,
    CurrencyPipe,
    TitleCasePipe,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatPaginatorModule,
  ],
})
export class TableComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() data: TTransactionView[] | undefined;

  @Input() currencyType: CurrencyType | undefined;

  dataSource: MatTableDataSource<TTransactionView> | undefined;

  definedColumns = [
    { def: 'category', showMobile: false },
    { def: 'description', showMobile: false },
    { def: 'date', showMobile: true },
    { def: 'amount', showMobile: true },
  ];

  isMobile: boolean = false;

  stickyHeader: boolean = true;

  subscription: Subscription | undefined;

  @ViewChild(MatSort) sort: MatSort | undefined;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private ref: ChangeDetectorRef,
    private iconService: CategoryIconMapperService
  ) {}

  ngOnInit(): void {
    this.subscription = this.breakpointObserver
      .observe(Breakpoints.XSmall)
      .pipe(
        tap((state) => {
          this.isMobile = state.matches;
          this.ref.markForCheck();
        })
      )
      .subscribe();

    this.dataSource = new MatTableDataSource(this.data);
  }

  ngAfterViewInit(): void {
    if (this.dataSource && this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  ngOnChanges(): void {
    if (this.data && this.sort) {
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.sort = this.sort;
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  getColumns() {
    return this.definedColumns
      .filter((c) => !this.isMobile || c.showMobile)
      .map((c) => c.def);
  }

  getIconName(category: TTransactionCategory): string {
    return this.iconService.getIconNameByCategory(category);
  }
}
