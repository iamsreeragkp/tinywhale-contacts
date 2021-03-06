import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { SwiperModule } from 'swiper/angular';
import { AuthRoutingModule } from './auth-routing.module';
import { SignUpPageComponent } from './pages/sign-up-page/sign-up-page.component';
import { LogInPageComponent } from './pages/log-in-page/log-in-page.component';
import { AuthStoreModule } from './store/auth-store.module';
import { AuthComponent } from './auth.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { CreatePasswordComponent } from './pages/create-password/create-password.component';
import { MoveNextByMaxLengthDirective } from './shared/moveNextByMaxLength.directive';

@NgModule({
  imports: [CommonModule, SharedModule, AuthRoutingModule, AuthStoreModule, SwiperModule],
  declarations: [SignUpPageComponent, LogInPageComponent, AuthComponent, ForgotPasswordComponent, CreatePasswordComponent,MoveNextByMaxLengthDirective],
  providers: [],
})
export class AuthModule {}
