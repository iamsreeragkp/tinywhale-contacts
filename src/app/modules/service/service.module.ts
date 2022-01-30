import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceRoutingModule } from './service-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ServiceComponent } from './service.component';
import { AddServiceComponent } from './pages/add-service/add-service.component';
import { ServiceListComponent } from './pages/service-list/service-list.component';
import { RootService } from '../root/root.service';
import { NoDataServiceComponentComponent } from './components/no-data-service-component/no-data-service-component.component';
import { NoResultServiceComponentComponent } from './components/no-result-service-component/no-result-service-component.component';
import { TableServiceComponentComponent } from './components/table-service-component/table-service-component.component';
import { ViewServiceComponent } from './pages/view-service/view-service.component';
import { ServiceStoreModule } from './store/service-store.module';
import { PreviewProductComponent } from './components/preview-product/preview-product.component';
// import { NoDataViewComponentComponent } from './components/no-data-view-component/no-data-view-component.component';

@NgModule({
  imports: [CommonModule, ServiceRoutingModule, SharedModule, ServiceStoreModule],
  declarations: [
    ServiceComponent,
    AddServiceComponent,
    ServiceListComponent,
    NoDataServiceComponentComponent,
    TableServiceComponentComponent,
    NoResultServiceComponentComponent,
    ViewServiceComponent,
    PreviewProductComponent,
  ],
  providers: [RootService],
})
export class ServiceModule {}
