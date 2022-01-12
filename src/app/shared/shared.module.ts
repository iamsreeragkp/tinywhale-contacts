import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoadingPlaceholderComponent } from './components/loading-placeholder/loading-placeholder.component';
import { CapitalizeFirstPipe } from './pipes/capitalize-first.pipe';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { HeroLoadingComponent } from './components/hero-loading/hero-loading.component';
import { HeroCardComponent } from './components/hero-card/hero-card.component';

@NgModule({
  imports: [CommonModule, FlexLayoutModule, ReactiveFormsModule, RouterModule, LazyLoadImageModule],
  declarations: [
    SpinnerComponent,
    LoadingPlaceholderComponent,
    CapitalizeFirstPipe,
    HeroLoadingComponent,
    HeroCardComponent,
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    SpinnerComponent,
    LoadingPlaceholderComponent,
    CapitalizeFirstPipe,
    LazyLoadImageModule,
    HeroLoadingComponent,
    HeroCardComponent,
  ],
})
export class SharedModule {}
