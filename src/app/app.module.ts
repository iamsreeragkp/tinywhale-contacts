import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from './modules/core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './modules/auth/auth.guard';
import { TokenInterceptor } from './modules/core/interceptors/token.interceptor';
import { RootGuard } from './modules/root/root.guard';
import { GoogleLoginProvider, SocialLoginModule } from 'angularx-social-login';
import { ToastrModule } from 'ngx-toastr';

registerLocaleData(localeEs, 'es');

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    CoreModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AppRoutingModule,
    SocialLoginModule,
    ToastrModule.forRoot(),
  ],
  declarations: [AppComponent],
  providers: [
    AuthGuard,
    RootGuard,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }, // For HttpInterceptors
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          // Google Authentication setup
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.google_client_id),
          },
        ],
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
