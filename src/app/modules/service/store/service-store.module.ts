import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ServiceEffects } from './service.effects';
import { serviceReducer } from './service.reducers';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('service', serviceReducer),
    EffectsModule.forFeature([ServiceEffects]),
  ],
  declarations: [],
})
export class ServiceStoreModule {}
