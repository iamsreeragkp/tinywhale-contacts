import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { userReducer } from './user.reducers';
import { UserEffects } from './user.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('user', userReducer),
    EffectsModule.forFeature([UserEffects]),
  ],
  declarations: [],
})
export class UserStoreModule {}
