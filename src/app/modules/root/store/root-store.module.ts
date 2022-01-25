import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RootEffects } from './root.effects';
import { rootReducer } from './root.reducers';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('root', rootReducer),
    EffectsModule.forFeature([RootEffects]),
  ],
  declarations: [],
})
export class RootStoreModule {}
