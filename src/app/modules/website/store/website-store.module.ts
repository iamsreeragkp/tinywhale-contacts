import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { WebsiteEffects } from './website.effects';
import { websiteReducer } from './website.reducers';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('website', websiteReducer),
    EffectsModule.forFeature([WebsiteEffects]),
  ],
  declarations: [],
})
export class WebsiteStoreModule {}
