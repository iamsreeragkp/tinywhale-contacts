import { Component, OnDestroy } from '@angular/core';
import { transition, trigger, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';
import { Store } from '@ngrx/store';
import { IRootState } from './store/root.reducers';
import { getDashboard } from './store/root.actions';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';

const sideNavDisableUrls = ['/home/add-business-info', '/home/add-service', '/home/add-payment'];

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
export class RootComponent implements OnDestroy {
  sideNavDisabled = false;
  ngUnsubscriber = new Subject<void>();
  constructor(private store: Store<IRootState>, private router: Router) {
    this.store.dispatch(getDashboard({ filters: {} }));
    router.events
      .pipe(
        takeUntil(this.ngUnsubscriber),
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(navEnd => {
        this.sideNavDisabled = sideNavDisableUrls.some(url =>
          (navEnd as NavigationEnd)?.urlAfterRedirects?.includes(url)
        );
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscriber.next();
    this.ngUnsubscriber.complete();
  }
}
