import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from './account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  constructor(private accountService:AccountService,private router:Router) { }

  ngOnInit(): void {
  }

  onLogout(){
    this.accountService.onlogout();
    this.router.navigate(['/'])
  }

}
