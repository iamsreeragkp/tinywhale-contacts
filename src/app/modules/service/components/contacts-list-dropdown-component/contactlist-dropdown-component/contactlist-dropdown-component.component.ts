import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contactlist-dropdown-component',
  templateUrl: './contactlist-dropdown-component.component.html',
  styleUrls: ['./contactlist-dropdown-component.component.scss']
})
export class ContactlistDropdownComponentComponent implements OnInit {
   noContacts = true;
  constructor() { }

  ngOnInit(): void {
  }

}
