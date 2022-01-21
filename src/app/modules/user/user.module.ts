import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { UserStoreModule } from './store/user-store.module';

@NgModule({
  imports: [CommonModule, SharedModule, UserStoreModule],
  declarations: [],
})
export class UserModule {}
