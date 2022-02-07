import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-data-service-component',
  templateUrl: './no-data-service-component.component.html',
  styleUrls: ['./no-data-service-component.component.scss']
})
export class NoDataServiceComponentComponent implements OnInit {

  @Input() doesProductListExists: Boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
