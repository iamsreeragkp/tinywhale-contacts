import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutesConfig } from 'src/app/configs/routes.config';
import { AccountComponent } from './account.component';
import { SettingsComponent } from './pages/settings/settings.component';

const accountRoutesConfig = RoutesConfig.routesNames.account;
const routesNames = RoutesConfig.routesNames;


const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo:routesNames.account.home},
      { path: accountRoutesConfig.settings, component: SettingsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
