import { Component } from '@angular/core';

@Component({
  selector: 'app-swiperlogo',
  templateUrl: './swiperlogo.component.svg',
  styleUrls: ['./swiperlogo.component.css']
})
export class SwiperlogoComponent {
  fillColor = 'rgb(255, 0, 0)';

  changeColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    this.fillColor = `rgb(${r}, ${g}, ${b})`;
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/