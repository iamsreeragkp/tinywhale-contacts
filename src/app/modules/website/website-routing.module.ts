import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewBusinessInfoComponent } from './pages/view-business-info/view-business-info.component';
import { RoutesConfig } from '../../configs/routes.config';
import { WebsiteComponent } from './website.component';
import { AddBusinessInfoComponent } from '../getting-started/pages/add-business-info/add-business-info.component';

const websiteRoutesConfig = RoutesConfig.routesNames.website;
const routesNames = RoutesConfig.routesNames;

const websiteRoutes: Routes = [
  {
    path: '',
    component: WebsiteComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: routesNames.website.viewBusinessInfo },
      { path: websiteRoutesConfig.addBusinessInfo, component: AddBusinessInfoComponent },
      { path: websiteRoutesConfig.viewBusinessInfo, component: ViewBusinessInfoComponent },
      { path: websiteRoutesConfig.editBusinessInfo, component: AddBusinessInfoComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(websiteRoutes)],
  exports: [RouterModule],
})
export class WebsiteRoutingModule {}
