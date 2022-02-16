import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-result-booking-component',
  templateUrl: './no-result-booking-component.component.html',
  styleUrls: ['./no-result-booking-component.component.scss'],
})
export class NoResultBookingComponentComponent implements OnInit {
  @Input() item: any;
  constructor() {}

  ngOnInit(): void {}

  onNavigateToBookings() {
    if (!this.item?.length) {
      window.location.reload();
    }
  }
}
