import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { SignUpPageComponent } from './pages/sign-up-page/sign-up-page.component';
import { LogInPageComponent } from './pages/log-in-page/log-in-page.component';
import { AuthStoreModule } from './store/auth-store.module';
import { AuthComponent } from './auth.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, SharedModule, AuthRoutingModule, AuthStoreModule],
  declarations: [SignUpPageComponent, LogInPageComponent, AuthComponent],
  providers: [],
})
export class AuthModule {}
