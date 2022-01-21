import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutesConfig } from '../../configs/routes.config';
import { NoDataViewComponentComponent } from '../root/shared/no-data-view-component/no-data-view-component.component';
import { AddBusinessInfoComponent } from './pages/add-business-info/add-business-info.component';
import { WebsiteComponent } from './website.component';


const websiteRoutesConfig = RoutesConfig.routesNames.website;
const routesNames = RoutesConfig.routesNames;


const websiteRoutes: Routes = [
  {
    path: '',
    component: WebsiteComponent,
    children: [

      { path: '', pathMatch: 'full', redirectTo:routesNames.website.home},
      { path: websiteRoutesConfig.home, component: NoDataViewComponentComponent },
      { path: websiteRoutesConfig.addbusinessinfo, component: AddBusinessInfoComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(websiteRoutes)],
  exports: [RouterModule],
})
export class WebsiteRoutingModule {}
