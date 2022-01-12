import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { heroReducer } from './hero.reducers';
import { HeroEffects } from './hero.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('hero', heroReducer),
    EffectsModule.forFeature([HeroEffects]),
  ],
  declarations: [],
})
export class HeroStoreModule {}
