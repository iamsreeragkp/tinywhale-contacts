import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewBookingComponent } from './pages/view-booking/view-booking.component';
import { RoutesConfig } from '../../configs/routes.config';
import { AddBookingComponent } from './pages/add-booking/add-booking.component';
import { StatusBookingComponent } from './pages/status-booking/status-booking.component';
import { BookingComponent } from './booking.component';

const bookingRoutesConfig = RoutesConfig.routesNames.booking;
const routesNames = RoutesConfig.routesNames;

const bookingRoutes: Routes = [
  {
    path: '',
    component: BookingComponent,
    children: [

      { path: '', pathMatch: 'full', redirectTo:routesNames.booking.viewBooking},
      { path: bookingRoutesConfig.addBooking, component: AddBookingComponent },
      { path: bookingRoutesConfig.viewBooking, component: ViewBookingComponent },
      { path: bookingRoutesConfig.statusBooking, component: StatusBookingComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bookingRoutes)],
  exports: [RouterModule],
})
export class BookingRoutingModule {}
