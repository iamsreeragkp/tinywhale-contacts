import { Component } from '@angular/core';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router, RouterEvent } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  loading!: boolean;
  constructor(private router: Router, private authService: AuthService) {
    this.loading = false;
    this.router.events.subscribe((events: RouterEvent | any) => {
      if (events instanceof RouteConfigLoadStart) {
        this.loading = true;
      } else if (events instanceof RouteConfigLoadEnd) {
        this.loading = false;
      }
    });
  }

  onLogout() {
    this.authService.onlogout();
    this.router.navigate(['/']);
  }
}
