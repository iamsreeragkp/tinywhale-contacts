import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { IRootState } from '../../store/root.reducers';
import { getDashboardData } from '../../store/root.selectors';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit, OnDestroy {
  dashboard$: Observable<any>;
  ngUnsubscriber = new Subject<void>();
  dashboardInfos: any = undefined;
  businessInfo: any;
  paymentInfo: any;
  serviceInfo: any;

  @Input() disabled = false;

  constructor(private store: Store<IRootState>) {
    this.dashboard$ = store.pipe(select(getDashboardData));
  }

  ngOnInit(): void {
    this.subscriptions();
  }

  subscriptions() {
    this.dashboard$.pipe(takeUntil(this.ngUnsubscriber)).subscribe(data => {
      this.dashboardInfos = data;
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscriber.next();
    this.ngUnsubscriber.complete();
  }
}
