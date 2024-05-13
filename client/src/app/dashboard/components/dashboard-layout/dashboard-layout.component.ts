import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgClass, AsyncPipe } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable, filter, map, tap } from 'rxjs';

import { Store } from '@ngrx/store';
import { UserActions } from '@app/store/user/user.actions';
import { UserState } from '@app/store/user/user.reducer';
import { selectUser } from '@app/store/user/user.selectors';
import { AuthService } from '@app/auth/services/auth.service';

import { SideNavbarComponent } from '../side-navbar/side-navbar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
  imports: [
    NgClass,
    AsyncPipe,
    RouterModule,
    MatSidenavModule,
    SideNavbarComponent,
    HeaderComponent,
  ],
})
export class DashboardLayoutComponent implements OnInit {
  private readonly breakpoint: string = '(max-width: 960px)';

  private userId: string | null = null;

  user$: Observable<UserState> | undefined;

  isTablet$: Observable<boolean> | undefined;

  isChangeView$: Observable<boolean> | undefined;

  changeView$: Observable<unknown> | undefined;

  @ViewChild('mainContainer') ref: ElementRef | undefined;

  constructor(
    private store: Store,
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();

    if (this.userId) {
      this.store.dispatch(UserActions.getUserWithBudget({ id: this.userId }));
    }

    this.user$ = this.store.select(selectUser);

    this.isTablet$ = this.breakpointObserver.observe(this.breakpoint).pipe(
      tap(() => {
        if (this.ref?.nativeElement?.scrollTop) {
          this.ref.nativeElement.scrollTop = 0;
        }
      }),
      map((state) => state.matches)
    );

    this.isChangeView$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => true),
      tap((navigateEnd) => {
        if (navigateEnd && this.ref?.nativeElement?.scrollTop) {
          this.ref.nativeElement.scrollTop = 0;
        }
      })
    );
  }
}
