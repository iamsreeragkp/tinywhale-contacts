import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoadingPlaceholderComponent } from './components/loading-placeholder/loading-placeholder.component';
import { CapitalizeFirstPipe } from './pipes/capitalize-first.pipe';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { HeroLoadingComponent } from './components/hero-loading/hero-loading.component';
import { HeroCardComponent } from './components/hero-card/hero-card.component';
import { LogoComponent } from './svgs/logo/logo.component';
import { BasicinfoComponent } from './svgs/basic info/basicinfo.component';
import { AddserviceComponent } from './svgs/addservice/addservice.component';
import { PaymentComponent } from './svgs/payment/payment.component';
import { CompleteiconComponent } from './svgs/completeicon/completeicon.component';
import { WarningiconComponent } from './svgs/warningicon/warningicon.component';
import { FormwarningComponent } from './svgs/formwarning/formwarning.component';
import { FormrightComponent } from './svgs/formright/formright.component';
import { PasswordCorrectComponent } from './svgs/passwordcorrect/passwordcorrect.component';
import { PasswordWarningComponent } from './svgs/passwordwarning/passwordwarning.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LazyLoadImageModule],
  declarations: [
    SpinnerComponent,
    LoadingPlaceholderComponent,
    CapitalizeFirstPipe,
    HeroLoadingComponent,
    HeroCardComponent,
    LogoComponent,
    BasicinfoComponent,
    AddserviceComponent,
    PaymentComponent,
    CompleteiconComponent,
    WarningiconComponent,
    FormwarningComponent,
    FormrightComponent,
    PasswordCorrectComponent,
    PasswordWarningComponent,
  ],
  exports: [
    CommonModule,
    SpinnerComponent,
    LoadingPlaceholderComponent,
    CapitalizeFirstPipe,
    LazyLoadImageModule,
    HeroLoadingComponent,
    HeroCardComponent,
    LogoComponent,
    BasicinfoComponent,
    AddserviceComponent,
    PaymentComponent,
    CompleteiconComponent,
    WarningiconComponent,
    FormwarningComponent,
    FormrightComponent,
    PasswordCorrectComponent,
    PasswordWarningComponent,
  ],
})
export class SharedModule {}
