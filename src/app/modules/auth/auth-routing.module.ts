import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoutesConfig } from '../../configs/routes.config';
import { SignUpPageComponent } from './pages/sign-up-page/sign-up-page.component';
import { LogInPageComponent } from './pages/log-in-page/log-in-page.component';
import { AuthComponent } from './auth.component';
import { RootGuard } from '../root/root.guard';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { CreatePasswordComponent } from './pages/create-password/create-password.component';
import { AuthResolver } from './shared/auth.resolver';

const authRoutes = RoutesConfig.routesNames.auth;

const authenticationRoutes: Routes = [
  {
    path: '',
    component: AuthComponent,
    // canActivate: [RootGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: RoutesConfig.routes.auth.logIn },
      { path: authRoutes.signUp, component: SignUpPageComponent, resolve: { auth: AuthResolver } },
      { path: authRoutes.logIn, component: LogInPageComponent, resolve: { auth: AuthResolver } },
      { path: authRoutes.forgotPassword, component: ForgotPasswordComponent },
      { path: authRoutes.createPassword, component: CreatePasswordComponent },
      { path: '**', redirectTo: RoutesConfig.routes.error404 },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(authenticationRoutes)],
  exports: [RouterModule],
  providers: [AuthResolver],
})
export class AuthRoutingModule {}
