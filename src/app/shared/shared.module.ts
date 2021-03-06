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
import { NumberDirective } from './directives/number.directive';
import { ArrayJoinPipe } from './pipes/array-join.pipe';
import { GroupWeekDaysPipe } from './pipes/group-weekdays';
import { ThreeDotsComponent } from './components/three-dots/three-dots.component';
import { ModalComponent } from './components/modal/modal.component';
import { GoogleiconComponent } from './svgs/googleicon/googleicon.component';
import { WindowComponent } from './components/window/window.component';
import { PortalModule } from '@angular/cdk/portal';
import { TextareaAutoresizeDirective } from './directives/auto-resize.directive';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { SelectCalendarComponent } from './components/select-calendar/select-calendar.component';
import { CalendarSvgComponent } from './svgs/calendarSvg/calendar-svg.component';
import { LoaderPageComponent } from '../modules/root/pages/loader-page/loader-page.component';
import { PhoneNumberInputComponent } from './components/phone-number-input/phone-number-input.component';
import { BackbuttonComponent } from './components/backbutton/backbutton/backbutton.component';


@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LazyLoadImageModule,
    PortalModule,
    AngularMyDatePickerModule,
  ],
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
    NumberDirective,
    ArrayJoinPipe,
    GroupWeekDaysPipe,
    ThreeDotsComponent,
    ModalComponent,
    GoogleiconComponent,
    WindowComponent,
    TextareaAutoresizeDirective,
    SelectCalendarComponent,
    CalendarSvgComponent,
    LoaderPageComponent,
    PhoneNumberInputComponent,
    BackbuttonComponent,
    
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
    NumberDirective,
    ArrayJoinPipe,
    GroupWeekDaysPipe,
    ThreeDotsComponent,
    ModalComponent,
    GoogleiconComponent,
    WindowComponent,
    TextareaAutoresizeDirective,
    SelectCalendarComponent,
    LoaderPageComponent,
    PhoneNumberInputComponent,
    BackbuttonComponent,
  ],
})
export class SharedModule {}
