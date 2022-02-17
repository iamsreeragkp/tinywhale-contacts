import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-result-service-component',
  templateUrl: './no-result-service-component.component.html',
  styleUrls: ['./no-result-service-component.component.scss'],
})
export class NoResultServiceComponentComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter<string>();

  constructor(private router: Router) {}

  ngOnInit(): void {}
  onNavigateService(value: any) {
    this.newItemEvent.emit(value);
  }
}
