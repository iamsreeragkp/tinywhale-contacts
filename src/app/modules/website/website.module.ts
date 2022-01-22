import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsiteRoutingModule } from './website-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { WebsiteComponent } from './website.component';
import { AddBusinessInfoComponent } from './pages/add-business-info/add-business-info.component';
import { ViewBusinessInfoComponent } from './pages/view-business-info/view-business-info.component';

@NgModule({
  imports: [CommonModule, WebsiteRoutingModule, SharedModule],
  declarations: [WebsiteComponent, AddBusinessInfoComponent, ViewBusinessInfoComponent],
  providers: [],
})
export class WebsiteModule {}
