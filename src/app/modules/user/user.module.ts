import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserStoreModule } from './store/user-store.module';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, SharedModule, UserStoreModule],
  declarations: [],
})
export class UserModule {}
