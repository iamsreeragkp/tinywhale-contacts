import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-result-service-component',
  templateUrl: './no-result-service-component.component.html',
  styleUrls: ['./no-result-service-component.component.scss'],
})
export class NoResultServiceComponentComponent implements OnInit {
  @Input() item: any;
  constructor(private router: Router) {}

  ngOnInit(): void {}
  onNavigateService() {
    if (!this.item?.length) {
      window.location.reload();
    }
  }
}
