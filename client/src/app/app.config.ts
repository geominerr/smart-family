import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import {
  provideAnimations,
  provideNoopAnimations,
} from '@angular/platform-browser/animations';
import {
  PreloadAllModules,
  provideRouter,
  withPreloading,
} from '@angular/router';

import { routes } from '@app/app.routes';
import { AuthInterceptor } from '@app/auth/interceptor/auth.interceptor';
import { BaseUrlInterceptor } from '@app/shared/interceptors/base-url.interceptor';
import { HttpStateInterceptor } from '@app/shared/interceptors/http-state.interceptor';
import {
  getProviderStore,
  getProviderEffects,
  getProviderDevStore,
} from '@app/store/store.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideNoopAnimations(),
    getProviderStore(),
    getProviderEffects(),
    getProviderDevStore(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseUrlInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpStateInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
};
