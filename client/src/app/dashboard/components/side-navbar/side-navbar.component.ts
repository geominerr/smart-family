import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AsyncPipe, NgFor, NgIf, NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Observable, map, tap } from 'rxjs';

import { SvgIconsModule } from '@app/shared/modules/svg-icons.module';
import { OutsideClickDirective } from '@app/shared/directives/outside-click.directive';
import { LogoutPopupComponent } from '@app/auth/components/logout-popup/logout-popup.component';

import { INavLink } from '../../models/nav-link.model';
import { navLinks } from './nav-link.data';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.scss'],
  imports: [
    AsyncPipe,
    NgIf,
    NgFor,
    NgClass,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    SvgIconsModule,
    OutsideClickDirective,
    LogoutPopupComponent,
  ],
})
export class SideNavbarComponent implements OnInit {
  navLinks: INavLink[] = navLinks;

  tabletBreakpoint: string = '(max-width: 960px)';

  isTablet$!: Observable<boolean>;

  isMobile$!: Observable<boolean>;

  isOpened: boolean = true;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isTablet$ = this.breakpointObserver
      .observe(this.tabletBreakpoint)
      .pipe(
        tap(() => {
          this.isOpened = false;
        }),
        map((state) => state.matches)
      );

    this.isMobile$ = this.breakpointObserver
      .observe(Breakpoints.XSmall)
      .pipe(map((state) => state.matches));
  }

  openDialog() {
    this.matDialog.open(LogoutPopupComponent);
  }

  open(e: Event) {
    e.stopPropagation();

    this.isOpened = true;
  }

  close() {
    this.isOpened = false;
  }
}
