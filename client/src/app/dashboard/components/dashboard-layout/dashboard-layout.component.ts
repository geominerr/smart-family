import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';

import { SideNavbarComponent } from '../side-navbar/side-navbar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
  imports: [
    RouterModule,
    MatSidenavModule,
    SideNavbarComponent,
    HeaderComponent,
  ],
})
export class DashboardLayoutComponent {}
