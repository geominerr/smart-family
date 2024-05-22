import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/auth/guards/auth.guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard-layout/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent
      ),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () =>
          import('./components/overview/overview.component').then(
            (m) => m.OverviewComponent
          ),
        canActivate: [AuthGuard],
      },

      {
        path: 'transactions',
        loadComponent: () =>
          import('./components/transactions/transactions.component').then(
            (m) => m.TransactionsComponent
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'income',
        loadComponent: () =>
          import('./components/income/income.component').then(
            (m) => m.IncomeComponent
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'expenses',
        loadComponent: () =>
          import('./components/expenses/expenses.component').then(
            (m) => m.ExpensesComponent
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./components/settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(DASHBOARD_ROUTES)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
