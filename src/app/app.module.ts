import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './modules/core/core.module';
import { RootModule } from './modules/root/root.module';
import { AppRoutingModule } from './app-routing.module';

registerLocaleData(localeEs, 'es');

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    HttpClientModule,
    CoreModule,
    RootModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AppRoutingModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
