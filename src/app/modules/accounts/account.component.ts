import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  constructor(private router: Router, private authService: AuthService) {}

  onLogout() {
    this.authService.onlogout();
    this.router.navigate(['/']);
  }
}
