import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@root/environments/environment';

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
  private readonly ASSETS_PATH = 'assets';

  private readonly API_URL: string = environment.apiUrl;

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const { url } = req;

    if (url.includes(this.ASSETS_PATH)) {
      return next.handle(req);
    }

    const updatedReq = req.clone({
      url: `${this.API_URL}/${url}`,
      withCredentials: true,
    });

    return next.handle(updatedReq);
  }
}
