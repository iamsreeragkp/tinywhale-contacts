import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsiteRoutingModule } from './website-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { WebsiteComponent } from './website.component';
import { AddBusinessInfoComponent } from './pages/add-business-info/add-business-info.component';

@NgModule({
  imports: [CommonModule, WebsiteRoutingModule, SharedModule],
  declarations: [WebsiteComponent, AddBusinessInfoComponent],
  providers: [],
})
export class WebsiteModule {}
