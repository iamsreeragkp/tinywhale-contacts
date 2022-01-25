import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsiteRoutingModule } from './website-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { WebsiteComponent } from './website.component';
import { AddBusinessInfoComponent } from './pages/add-business-info/add-business-info.component';
import { ViewBusinessInfoComponent } from './pages/view-business-info/view-business-info.component';
import { RootService } from '../root/root.service';
import { NoDataViewComponentComponent } from './components/no-data-view-component/no-data-view-component.component';
import { WebsiteStoreModule } from './store/website-store.module';

@NgModule({
  imports: [CommonModule, WebsiteRoutingModule, SharedModule, WebsiteStoreModule],
  declarations: [
    WebsiteComponent,
    AddBusinessInfoComponent,
    ViewBusinessInfoComponent,
    NoDataViewComponentComponent,
  ],
  providers: [RootService],
})
export class WebsiteModule {}
