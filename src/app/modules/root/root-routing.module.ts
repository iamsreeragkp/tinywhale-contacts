import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { RoutesConfig } from '../../configs/routes.config';
import { Error404PageComponent } from './pages/error404-page/error404-page.component';

const routesNames = RoutesConfig.routesNames;

const rootRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: RoutesConfig.basePaths.hero },
  {
    path: RoutesConfig.basePaths.auth,
    loadChildren: () => import('../auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: RoutesConfig.basePaths.hero,
    loadChildren: () => import('../hero/hero.module').then(m => m.HeroModule),
  },
  { path: routesNames.home, component: HomePageComponent, pathMatch: 'full' },
  { path: routesNames.error404, component: Error404PageComponent },
  { path: '**', redirectTo: RoutesConfig.routes.error404 },
];

@NgModule({
  imports: [RouterModule.forChild(rootRoutes)],
  exports: [RouterModule],
})
export class RootRoutingModule {}
