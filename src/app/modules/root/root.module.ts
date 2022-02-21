import { NgModule } from '@angular/core';
import { FooterComponent } from './shared/footer/footer.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { Error404PageComponent } from './pages/error404-page/error404-page.component';
import { RootRoutingModule } from './root-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { RootComponent } from './root.component';
import { SideNavComponent } from './shared/side-nav/side-nav.component';
import { CardGetstartedComponent } from './shared/card-getstarted/card-getstarted.component';
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { RootService } from './root.service';
import { RootStoreModule } from './store/root-store.module';
// import { RouterLinkDisabledDirective } from 'src/app/shared/directives/router-link-disabled.directive';
import { GettingStartedModule } from '../getting-started/getting-started.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgApexchartsModule } from "ng-apexcharts";


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RootRoutingModule,
    RootStoreModule,
    GettingStartedModule,
    NgxChartsModule,
    NgApexchartsModule,
  ],
  declarations: [
    HomePageComponent,
    Error404PageComponent,
    FooterComponent,
    RootComponent,
    SideNavComponent,
    CardGetstartedComponent,
    DashboardComponent,
    // RouterLinkDisabledDirective,
  ],
  exports: [HomePageComponent, Error404PageComponent, FooterComponent],
  providers: [RootService],
})
export class RootModule { }
