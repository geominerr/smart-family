import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/auth/guards/auth.guard';

import { OverviewComponent } from './components/overview/overview.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { IncomeComponent } from './components/income/income.component';
import { ExpensesComponent } from './components/expenses/expenses.component';
import { BillsComponent } from './components/bills/bills.component';
import { GoalsComponent } from './components/goals/goals.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
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
        component: OverviewComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'transactions',
        component: TransactionsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'income',
        component: IncomeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'expenses',
        component: ExpensesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'bills',
        component: BillsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'goals',
        component: GoalsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
