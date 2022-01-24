import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceRoutingModule } from './service-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ServiceComponent } from './service.component';
import { AddServiceComponent } from './pages/add-service/add-service.component';
import { ViewServiceComponent } from './pages/view-service/view-service.component';
import { RootService } from '../root/root.service';
import { NoDataViewComponentComponent } from './components/no-data-view-component/no-data-view-component.component';

@NgModule({
  imports: [CommonModule, ServiceRoutingModule, SharedModule],
  declarations: [ServiceComponent, AddServiceComponent, ViewServiceComponent, NoDataViewComponentComponent],
  providers: [RootService],
})
export class ServiceModule {}
