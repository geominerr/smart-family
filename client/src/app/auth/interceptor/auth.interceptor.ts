import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable, catchError, switchMap, throwError } from 'rxjs';

import { AuthService } from '@app/auth/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly UNAUTHORIZED: number = 401;

  private readonly BAD_REQUEST: number = 400;

  private readonly SIGNIN_ROUTE: string = 'signin';

  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err?.status === this.UNAUTHORIZED) {
          return this.authService.refreshToken().pipe(
            switchMap(() => next.handle(req)),
            catchError((error: HttpErrorResponse) => {
              if (error?.status === this.BAD_REQUEST) {
                this.authService.removeAuthStatus();
                this.router.navigate([this.SIGNIN_ROUTE]);
              }

              return throwError(() => err);
            })
          );
        }

        return throwError(() => err);
      })
    );
  }
}
