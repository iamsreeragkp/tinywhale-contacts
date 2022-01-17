import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutesConfig } from '../../configs/routes.config';
import { SignUpPageComponent } from './pages/sign-up-page/sign-up-page.component';
import { LogInPageComponent } from './pages/log-in-page/log-in-page.component';
import { AuthComponent } from './auth.component';
import { RootGuard } from '../root/root.guard';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

const authRoutes = RoutesConfig.routesNames.auth;

const authenticationRoutes: Routes = [
  {
    path: '',
    component: AuthComponent,
    canActivate: [RootGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: RoutesConfig.routes.auth.logIn },
      { path: authRoutes.signUp, component: SignUpPageComponent },
      { path: authRoutes.logIn, component: LogInPageComponent },
      { path: authRoutes.forgotPassword, component: ForgotPasswordComponent },
      { path: '**', redirectTo: RoutesConfig.routes.error404 },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(authenticationRoutes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
