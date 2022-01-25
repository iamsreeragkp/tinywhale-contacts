import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AccountService } from './account.service';
import { AddPaymentComponent } from './pages/add-payment/add-payment.component';
import { ViewPaymentComponent } from './pages/view-payment/view-payment.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    AccountComponent,
    SettingsComponent,
    AddPaymentComponent,
    ViewPaymentComponent,
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    SharedModule,
  ],
  providers:[AccountService]
})
export class AccountModule { }
