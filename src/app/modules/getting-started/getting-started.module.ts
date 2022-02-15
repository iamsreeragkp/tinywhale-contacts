import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { WebsiteStoreModule } from '../website/store/website-store.module';
import { ServiceStoreModule } from '../service/store/service-store.module';
import { AccountStoreModule } from '../accounts/store/account-store.module';
import { AddServiceComponent } from './pages/add-service/add-service.component';
import { AddPaymentComponent } from './pages/add-payment/add-payment.component';
import { PreviewProductComponent } from './component/preview-product/preview-product.component';
import { AddBusinessInfoComponent } from './pages/add-business-info/add-business-info.component';

@NgModule({
  imports: [SharedModule, WebsiteStoreModule, ServiceStoreModule, AccountStoreModule],
  declarations: [
    AddBusinessInfoComponent,
    AddServiceComponent,
    AddPaymentComponent,
    PreviewProductComponent,
  ],
  exports: [
    AddBusinessInfoComponent,
    AddServiceComponent,
    AddPaymentComponent,
    PreviewProductComponent,
  ],
})
export class GettingStartedModule {}
