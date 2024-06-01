import { Routes } from '@angular/router';
import { authRoutes } from '@app/auth/auth.routes';
import { dashboardRoutes } from '@app/dashboard/dashboard.routes';
import { NotFoundPageComponent } from '@app/shared/components/not-found-page/not-found-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  ...dashboardRoutes,
  ...authRoutes,
  { path: '**', component: NotFoundPageComponent },
];
