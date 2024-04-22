import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { SvgIconsModule } from '@app/shared/modules/svg-icons.module';
import { Observable, map } from 'rxjs';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    NgClass,
    AsyncPipe,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    SvgIconsModule,
  ],
})
export class HeaderComponent implements OnInit {
  currDate: Date = new Date();

  isTablet$!: Observable<boolean>;

  isMobile$!: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit(): void {
    this.isTablet$ = this.breakpointObserver
      .observe(Breakpoints.Small)
      .pipe(map((state) => state.matches));

    this.isMobile$ = this.breakpointObserver
      .observe(Breakpoints.XSmall)
      .pipe(map((state) => state.matches));
  }
}
