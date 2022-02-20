import { Component } from '@angular/core';
import { transition, trigger, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(
        '* => *',
        useAnimation(fadeIn, {
          params: { timing: 1, delay: 0 },
        })
      ),
    ]),
  ],
})
export class ServiceComponent {
  loading!: boolean;
  constructor(private router: Router) {
    this.loading = false;
    this.router.events.subscribe((events: RouterEvent | any) => {
      if (events instanceof RouteConfigLoadStart) {
        this.loading = true;
      } else if (events instanceof RouteConfigLoadEnd) {
        this.loading = false;
      }
    });
  }
}
