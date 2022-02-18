import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { getDashboardData } from '../../../root/store/root.selectors';
import { IRootState } from 'src/app/modules/root/store/root.reducers';
import { getServiceList, initService } from '../../store/service.actions';
import { IServiceState } from '../../store/service.reducers';
import { getServiceListStatus } from '../../store/service.selectors';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss'],
})
export class ServiceListComponent implements OnInit, OnDestroy {
  dashboard$: Observable<any>;
  ngUnsubscriber = new Subject<void>();
  productList$!: Observable<any>;
  dashboardInfos: any = undefined;
  productCount!: number;
  constructor(private store: Store<IRootState>, private stores: Store<IServiceState>) {
    this.dashboard$ = store.pipe(select(getDashboardData));
    store.dispatch(getServiceList({ filters: {} }));
    this.productList$ = this.stores.pipe(
      select(getServiceListStatus),
      takeUntil(this.ngUnsubscriber)
    );
    this.productList$.subscribe((data: any) => {
      this.productCount = data?.productsCount;
    });
  }

  ngOnInit(): void {
    this.subscriptions();
  }

  subscriptions() {
    this.dashboard$.pipe(takeUntil(this.ngUnsubscriber)).subscribe(data => {
      this.dashboardInfos = data;
    });
  }

  get hasStarted() {
    return this.dashboardInfos?.domainActive || this.dashboardInfos?.serviceInfo?.isStarted;
  }

  ngOnDestroy(): void {
    this.ngUnsubscriber.next();
    this.ngUnsubscriber.complete();
    this.stores.dispatch(initService());
  }
}
