import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewServiceComponent } from './pages/view-service/view-service.component';
import { RoutesConfig } from '../../configs/routes.config';
import { AddServiceComponent } from './pages/add-service/add-service.component';
import { ServiceComponent } from './service.component';

const serviceRoutesConfig = RoutesConfig.routesNames.service;
const routesNames = RoutesConfig.routesNames;

const serviceRoutes: Routes = [
  {
    path: '',
    component: ServiceComponent,
    children: [

      { path: '', pathMatch: 'full', redirectTo:routesNames.service.viewService},
      { path: serviceRoutesConfig.addService, component: AddServiceComponent },
      { path: serviceRoutesConfig.viewService, component: ViewServiceComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(serviceRoutes)],
  exports: [RouterModule],
})
export class ServiceRoutingModule {}
