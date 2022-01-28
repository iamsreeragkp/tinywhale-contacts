import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { bookingReducer } from './booking.reducers';
import { BookingEffects } from './booking.effect';



@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('booking',bookingReducer ),
    EffectsModule.forFeature([BookingEffects]),
  ],
  declarations: [],
})
export class BookingStoreModule {}
