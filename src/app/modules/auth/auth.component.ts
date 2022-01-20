import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { transition, trigger, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';
import Swiper, { Navigation, Pagination } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

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
export class AuthComponent implements OnInit {
  slides = [1, 2, 3];
  @ViewChild('newSwiper') newSwiper: any;
  constructor() {
    Swiper.use([Navigation, Pagination]);
  }
  ngOnInit() {
    setTimeout(function () {
      var swiper = new Swiper('.swiper-container');
    }, 500);
  }
  swipePrev() {
    this.newSwiper.swiperRef.slidePrev();
  }
  swipeNext() {
    this.newSwiper.swiperRef.slideNext();
  }
}
