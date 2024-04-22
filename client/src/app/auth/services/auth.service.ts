import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { filter, map, tap } from 'rxjs';

import { CookiesService } from '@app/shared/services/cookies.service';
import { ILoginDto, ISignupDto, IResetDto } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_COOKIE: string = '_auth-status';

  private readonly BASE_ENDPOINT: string = 'auth';

  constructor(
    private httpClient: HttpClient,
    private cookiesService: CookiesService,
    private router: Router
  ) {}

  signup(dto: ISignupDto) {
    const endpoint = `${this.BASE_ENDPOINT}/signup`;

    return this.httpClient.post(endpoint, { ...dto });
  }

  login(dto: ILoginDto) {
    const endpoint = `${this.BASE_ENDPOINT}/signin`;

    return this.httpClient.post(endpoint, { ...dto }, { observe: 'response' });
  }

  logout() {
    const endpoint = `${this.BASE_ENDPOINT}/logout`;

    return this.httpClient.patch(endpoint, {}, { observe: 'response' }).pipe(
      filter((res) => res.status === 204),
      tap(() => {
        this.removeAuthStatus();
        this.router.navigate(['signin']);
      }),
      map(() => true)
    );
  }

  resetPassword(dto: IResetDto) {
    const endpoint = `${this.BASE_ENDPOINT}/reset`;

    return this.httpClient.post(endpoint, { ...dto }, { observe: 'response' });
  }

  refreshToken() {
    const endpoint = `${this.BASE_ENDPOINT}/refresh`;

    return this.httpClient.post(endpoint, {});
  }

  getAuthStatus(): boolean {
    const cookie = this.cookiesService.getCookie(this.AUTH_COOKIE);

    if (!cookie) {
      return false;
    }

    return true;
  }

  removeAuthStatus(): void {
    this.cookiesService.removeCookie(this.AUTH_COOKIE);
  }
}
