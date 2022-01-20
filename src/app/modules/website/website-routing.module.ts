import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutesConfig } from '../../configs/routes.config';
import { WebsiteComponent } from './website.component';


const websiteRoutesConfig = RoutesConfig.routesNames.website;
const routesNames = RoutesConfig.routesNames;


const websiteRoutes: Routes = [
  {
    path: '',
    component: WebsiteComponent,
    children: [

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(websiteRoutes)],
  exports: [RouterModule],
})
export class WebsiteRoutingModule {}
