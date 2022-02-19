import { Component, ViewChild } from '@angular/core';
import { transition, trigger, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';
import Swiper, { Navigation, Pagination } from 'swiper';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
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
export class AuthComponent {
  slides = [1, 2, 3];
  @ViewChild('newSwiper') newSwiper: any;
  loading!: boolean;
  constructor(private router: Router) {
    Swiper.use([Navigation, Pagination]);
    this.loading = false;
    this.router.events.subscribe((events: RouterEvent | any) => {
      if (events instanceof RouteConfigLoadStart) {
        this.loading = true;
      } else if (events instanceof RouteConfigLoadEnd) {
        this.loading = false;
      }
    });
  }

  swipePrev() {
    this.newSwiper.swiperRef.slidePrev();
  }
  swipeNext() {
    this.newSwiper.swiperRef.slideNext();
  }
}
