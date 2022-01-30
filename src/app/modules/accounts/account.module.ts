import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AccountService } from './account.service';
import { ViewPaymentComponent } from './pages/view-payment/view-payment.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccountStoreModule } from './store/account-store.module';
import { GettingStartedModule } from '../getting-started/getting-started.module';

@NgModule({
  declarations: [AccountComponent, SettingsComponent, ViewPaymentComponent],
  imports: [
    CommonModule,
    AccountRoutingModule,
    SharedModule,
    GettingStartedModule,
    AccountStoreModule,
  ],
  providers: [AccountService],
})
export class AccountModule {}
