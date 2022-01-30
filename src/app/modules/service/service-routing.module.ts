import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceListComponent } from './pages/service-list/service-list.component';
import { RoutesConfig } from '../../configs/routes.config';
import { AddServiceComponent } from './pages/add-service/add-service.component';
import { ServiceComponent } from './service.component';
import { ViewServiceComponent } from './pages/view-service/view-service.component';

const serviceRoutesConfig = RoutesConfig.routesNames.service;
const routesNames = RoutesConfig.routesNames;

const serviceRoutes: Routes = [
  {
    path: '',
    component: ServiceComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: routesNames.service.home },
      { path: serviceRoutesConfig.addService, component: AddServiceComponent },
      { path: serviceRoutesConfig.editService, component: AddServiceComponent },
      { path: serviceRoutesConfig.viewService, component: ViewServiceComponent },
      { path: serviceRoutesConfig.home, component: ServiceListComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(serviceRoutes)],
  exports: [RouterModule],
})
export class ServiceRoutingModule {}
