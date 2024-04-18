import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@app/auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  private readonly AUTH_ROUTES: string[] = [
    '/signup',
    '/signin',
    '/password-recovery',
  ];

  private readonly LOGIN_URL: string = 'signin';

  private readonly ROOT_URL: string = '/';

  constructor(private authService: AuthService, private router: Router) {}

  canActivate: CanActivateFn = (_, state) => {
    const isAuth = this.authService.getAuthStatus();
    const includesAuthUrl = this.AUTH_ROUTES.includes(state?.url);

    if (!isAuth && !includesAuthUrl) {
      this.router.navigate([this.LOGIN_URL]);

      return false;
    }

    if (isAuth && includesAuthUrl) {
      this.router.navigate([this.ROOT_URL]);

      return false;
    }

    return true;
  };
}
