import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { accountReducer } from './account.reducers';
import { AccountEffects } from './account.effect';


@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('account', accountReducer),
    EffectsModule.forFeature([AccountEffects]),
  ],
  declarations: [],
})
export class AccountStoreModule {}
