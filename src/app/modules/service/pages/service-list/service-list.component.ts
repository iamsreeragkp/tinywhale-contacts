import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { getDashboardData } from '../../../root/store/root.selectors';
import { IRootState } from 'src/app/modules/root/store/root.reducers';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss'],
})
export class ServiceListComponent {

  dashboard$: Observable<any>;
  ngUnsubscriber = new Subject<void>();
  dashboardInfos: any = undefined;
  constructor(private store: Store<IRootState>) {
    this.dashboard$ = store.pipe(select(getDashboardData));
  }

  ngOnInit(): void {
    this.subscriptions();
  }

  subscriptions() {
    this.dashboard$.pipe(takeUntil(this.ngUnsubscriber)).subscribe(data => {
      this.dashboardInfos = data; 
    }, err=> {
      console.log("ERROR OCCURED",err);
      
    });
    
  }

  hasStarted()
  {                                                                                       
    return ( this.dashboardInfos?.businessInfo?.isStarted || this.dashboardInfos?.serviceInfo?.isStarted || this.dashboardInfos?.paymentInfo?.isStarted)
  }

  ngOnDestroy(): void {
    this.ngUnsubscriber.next();
    this.ngUnsubscriber.complete();
  }
}
