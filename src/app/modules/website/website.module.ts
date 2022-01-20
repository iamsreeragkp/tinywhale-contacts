import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsiteRoutingModule } from './website-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [CommonModule, WebsiteRoutingModule, SharedModule],
  declarations: [],
  providers: [],
})
export class WebsiteModule {}
