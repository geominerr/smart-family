import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
    private cookiesService: CookiesService
  ) {}

  signup(dto: ISignupDto) {
    const endpoint = `${this.BASE_ENDPOINT}/signup`;

    return this.httpClient.post(endpoint, { ...dto });
  }

  login(dto: ILoginDto) {
    const endpoint = `${this.BASE_ENDPOINT}/signin`;

    return this.httpClient.post(endpoint, { ...dto }, { observe: 'response' });
  }

  resetPassword(dto: IResetDto) {
    const endpoint = `${this.BASE_ENDPOINT}/reset`;

    return this.httpClient.post(endpoint, { ...dto }, { observe: 'response' });
  }

  refreshToken() {
    const endpoint = `${this.BASE_ENDPOINT}/refresh`;

    return this.httpClient.get(endpoint);
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
