import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AccountService } from './account.service';


@NgModule({
  declarations: [
    AccountComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule
  ],
  providers:[AccountService]
})
export class AccountModule { }
