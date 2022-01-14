import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class RootGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise(resolve => {
      if (!this.authService.isLoggedIn()) {
        // check wheather a user is login or not
        resolve(true);
      } else {
        this.router.navigate(['']);
        resolve(false);
      }
    });
  }
}
