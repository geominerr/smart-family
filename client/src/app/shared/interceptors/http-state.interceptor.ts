import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, finalize } from 'rxjs';

import { RequestStateService } from '../services/request-state.service';

@Injectable({
  providedIn: 'root',
})
export class HttpStateInterceptor implements HttpInterceptor {
  constructor(private requestStateService: RequestStateService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.requestStateService.addRequest(req);

    return next.handle(req).pipe(
      finalize(() => {
        this.requestStateService.removeRequest(req);
      })
    );
  }
}
