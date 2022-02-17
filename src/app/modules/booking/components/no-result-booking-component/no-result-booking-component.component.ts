import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-no-result-booking-component',
  templateUrl: './no-result-booking-component.component.html',
  styleUrls: ['./no-result-booking-component.component.scss'],
})
export class NoResultBookingComponentComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter<string>();
  constructor() {}

  ngOnInit(): void {}

  onNavigateToBookings(value: any) {
    this.newItemEvent.emit(value);
  }
}
