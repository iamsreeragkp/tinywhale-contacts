import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutesConfig } from 'src/app/configs/routes.config';
import { AccountComponent } from './account.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AddPaymentComponent } from '../getting-started/pages/add-payment/add-payment.component';
import { ViewPaymentComponent } from './pages/view-payment/view-payment.component';

const accountRoutesConfig = RoutesConfig.routesNames.account;
const routesNames = RoutesConfig.routesNames;

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: routesNames.account.viewPayment },
      { path: accountRoutesConfig.settings, component: SettingsComponent },
      { path: accountRoutesConfig.addPayment, component: AddPaymentComponent },
      { path: accountRoutesConfig.viewPayment, component: ViewPaymentComponent },
      { path: accountRoutesConfig.editPayment, component: AddPaymentComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
