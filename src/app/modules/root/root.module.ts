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
import { RootService } from './root.service';

@NgModule({
  imports: [CommonModule, SharedModule, RootRoutingModule],
  declarations: [
    HomePageComponent,
    Error404PageComponent,
    FooterComponent,
    RootComponent,
    SideNavComponent,
    CardGetstartedComponent,
  ],
  exports: [HomePageComponent, Error404PageComponent, FooterComponent],
  providers:[RootService]
})
export class RootModule {}
