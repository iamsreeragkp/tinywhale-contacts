import { Component } from '@angular/core';
import { transition, trigger, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';
import { Store } from '@ngrx/store';
import { IRootState } from './store/root.reducers';
import { getDashboard } from './store/root.actions';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
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
export class RootComponent {
  constructor(private store: Store<IRootState>) {
    this.store.dispatch(getDashboard({ filters: {} }));
  }
}
