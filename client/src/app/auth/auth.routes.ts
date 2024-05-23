import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const authRoutes: Routes = [
  {
    path: 'signin',
    loadComponent: () =>
      import('./components/signin/signin.component').then(
        (m) => m.SigninComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./components/signup/signup.component').then(
        (m) => m.SignupComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'password-recovery',
    loadComponent: () =>
      import('./components/password-recovery/password-recovery.component').then(
        (m) => m.PasswordRecoveryComponent
      ),
    canActivate: [AuthGuard],
  },
];
