import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-passwordcorrect',
  templateUrl: './passwordcorrect.component.svg',
  styleUrls: ['./passwordcorrect.component.css'],
})
export class PasswordCorrectComponent {
  fillColor = '#D6E1E3';
  @Input() set valid(value: string) {
    this.fillColor = value;
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
