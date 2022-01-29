import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingPlaceholderComponent } from './components/loading-placeholder/loading-placeholder.component';
import { CapitalizeFirstPipe } from './pipes/capitalize-first.pipe';
import { LazyLoadImageModule } from 'ng-lazyload-image';
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
import { SwiperlogoComponent } from './svgs/swiperlogo/swiperlogo.component';
import { SwipernextComponent } from './svgs/swipernext/swipernext.component';
import { ClosedeyeComponent } from './svgs/closedeye/closedeye.component';
import { NoDataViewWebsiteSvgComponent } from './svgs/no-data-view-website/no-data-view-website.component';
import { NoResultViewWebsiteSvgComponent } from './svgs/no-result-view-website/no-result-view-website.component';
import { RouterModule } from '@angular/router';
import { OpenedeyeComponent } from './svgs/openedeye/openedeye.component';
import { AwaitingComponent } from './svgs/awaiting/awaiting.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';


@NgModule({
  imports: [RouterModule, CommonModule, ReactiveFormsModule, FormsModule, LazyLoadImageModule,],
  declarations: [
    SpinnerComponent,
    LoadingPlaceholderComponent,
    CapitalizeFirstPipe,
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
    SwiperlogoComponent,
    SwipernextComponent,
    ClosedeyeComponent,
    NoDataViewWebsiteSvgComponent,
    NoResultViewWebsiteSvgComponent,
    OpenedeyeComponent,
    AwaitingComponent,
    DropdownComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerComponent,
    LoadingPlaceholderComponent,
    CapitalizeFirstPipe,
    LazyLoadImageModule,
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
    SwiperlogoComponent,
    SwipernextComponent,
    ClosedeyeComponent,
    NoDataViewWebsiteSvgComponent,
    NoResultViewWebsiteSvgComponent,
    OpenedeyeComponent,
    AwaitingComponent,
    DropdownComponent,
  ],
})
export class SharedModule {}
