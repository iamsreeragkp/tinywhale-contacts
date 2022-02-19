import { NgModule } from '@angular/core';
import { BookingRoutingModule } from './booking-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BookingComponent } from './booking.component';
import { AddBookingComponent } from './pages/add-booking/add-booking.component';
import { ViewBookingComponent } from './pages/view-booking/view-booking.component';
import { RootService } from '../root/root.service';
import { NoDataBookingComponentComponent } from './components/no-data-booking-component/no-data-booking-component.component';
import { NoResultBookingComponentComponent } from './components/no-result-booking-component/no-result-booking-component.component';
import { TableBookingComponentComponent } from './components/table-booking-component/table-booking-component.component';
import { ServiceStoreModule } from '../service/store/service-store.module';
import { BookingStoreModule } from './store/booking-store.module';
import { StatusBookingComponent } from './pages/status-booking/status-booking.component';

@NgModule({
  imports: [BookingRoutingModule, SharedModule, BookingStoreModule, ServiceStoreModule],
  declarations: [
    BookingComponent,
    AddBookingComponent,
    ViewBookingComponent,
    NoDataBookingComponentComponent,
    TableBookingComponentComponent,
    NoResultBookingComponentComponent,
    StatusBookingComponent,
  ],
  providers: [RootService],
})
export class BookingModule {}
