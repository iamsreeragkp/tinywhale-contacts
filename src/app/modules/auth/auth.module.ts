import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { SwiperModule } from 'swiper/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { SignUpPageComponent } from './pages/sign-up-page/sign-up-page.component';
import { LogInPageComponent } from './pages/log-in-page/log-in-page.component';
import { AuthStoreModule } from './store/auth-store.module';
import { AuthComponent } from './auth.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { CreatePasswordComponent } from './pages/create-password/create-password.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, SharedModule, AuthRoutingModule, AuthStoreModule, FormsModule,SwiperModule],
  declarations: [SignUpPageComponent, LogInPageComponent, AuthComponent, ForgotPasswordComponent, CreatePasswordComponent],
  providers: [],
})
export class AuthModule {}
