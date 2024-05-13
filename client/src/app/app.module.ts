import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './auth/interceptor/auth.interceptor';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { BaseUrlInterceptor } from './shared/interceptors/base-url.interceptor';
import { HttpStateInterceptor } from './shared/interceptors/http-state.interceptor';
import { StatusBarComponent } from './shared/components/status-bar/status-bar.component';
import { DashboardRoutingModule } from './dashboard/dashboard-routing.module';
import { StoreAppModule } from './store/store-app.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    AuthRoutingModule,
    DashboardRoutingModule,
    StoreAppModule,
    StatusBarComponent,
  ],
  providers: [
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
  bootstrap: [AppComponent],
})
export class AppModule {}
