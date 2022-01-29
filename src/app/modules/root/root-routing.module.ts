import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { RoutesConfig } from '../../configs/routes.config';
import { Error404PageComponent } from './pages/error404-page/error404-page.component';
import { AuthGuard } from '../auth/auth.guard';
import { RootComponent } from './root.component';

const routesNames = RoutesConfig.routesNames;

const rootRoutes: Routes = [
  {
    path: '',
    component: RootComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: RoutesConfig.routes.home,
      },
      {
        path: RoutesConfig.basePaths.website,
        loadChildren: () => import('../website/website.module').then(m => m.WebsiteModule),
        canActivate: [AuthGuard],
      },
      {
        path: RoutesConfig.basePaths.service,
        loadChildren: () => import('../service/service.module').then(m => m.ServiceModule),
        canActivate: [AuthGuard],
      },
      {
        path: RoutesConfig.basePaths.booking,
        loadChildren: () => import('../booking/booking.module').then(m => m.BookingModule),
        canActivate: [AuthGuard],
      },
      {
        path: RoutesConfig.basePaths.account,
        loadChildren: () => import('../accounts/account.module').then(m => m.AccountModule),
        canActivate: [AuthGuard],
      },
      {
        path: routesNames.home,
        component: HomePageComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
      { path: routesNames.error404, component: Error404PageComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(rootRoutes)],
  exports: [RouterModule],
})
export class RootRoutingModule {}
