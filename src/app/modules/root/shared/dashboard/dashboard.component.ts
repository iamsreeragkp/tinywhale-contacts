import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { getDashboardList } from '../../store/root.actions';
import { IRootState } from '../../store/root.reducers';
import { getDashboardData, getDashboardLists } from '../../store/root.selectors';
import { multi, single } from './data';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  dashboard$: Observable<any>;
  ngUnsubscriber = new Subject<void>();
  dashboardInfos: any = undefined;
  // options
  multi: any[] = multi;
  single: any[] = single;
  view: any[] = [700, 300];
  height: number = 280;
  gradient: boolean = false;
  showGridLines: boolean = false;
  fitContainer: boolean = true;
  legend: boolean = false;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = false;
  showXAxisLabel: boolean = false;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = false;
  barPadding: number = 50;
  chart1: any;
  chart2: any;
  chart3: any;
  percentage: any;

  colorScheme: Color = {
    name: 'primary',
    selectable: true,
    group: ScaleType.Linear,
    domain: ['#00A4B7'],
  };
  colorSchemeBar = {
    name: 'bar',
    selectable: true,
    group: ScaleType.Linear,
    domain: ['#ED9F7C'],
  };
  colorSchemeCurve = {
    name: 'curve',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#E1C700'],
  };

  priceData: any;
  priceLineData = [];
  customerLifeTime: any;
  customerLineData: any = [];
  serviceUtilizationData: any;
  serviceUtilizationLineData: any = [];
  potential: any;
  upcomingSessions: any;
  orderLineItem: any;
  ngUnsubscribe = new Subject<any>();

  constructor(private store: Store<IRootState>, private router: Router) {
    this.dashboard$ = store.pipe(
      select(getDashboardLists),
      takeUntil(this.ngUnsubscribe),
      filter(val => !!val)
    );

    this.store.dispatch(getDashboardList({ filters: {} }));
    this.dashboard$ = store.pipe(select(getDashboardLists));
    // this.dashboard$ = store.pipe(select(getDashboardData));
  }

  ngOnInit(): void {
    this.subscriptions();
  }
  subscriptions() {
    this.dashboard$.pipe(takeUntil(this.ngUnsubscriber)).subscribe(data => {
      this.dashboardInfos = data;
      console.log(this.dashboardInfos);

      const currentMonth = this.dashboardInfos?.processing_fee?.current_month;
      const lastMonth = this.dashboardInfos?.processing_fee?.last_month;

      const difference = currentMonth - lastMonth;
      const lastMonthMeasurement = difference / lastMonth;
      this.percentage = lastMonthMeasurement * 100;

      this.priceData = this.dashboardInfos?.price_data;
      this.upcomingSessions = this.dashboardInfos?.upcoming_sessions;
      for (let i = 0; i < this.priceData?.length; i++) {
        this.priceLineData = this.priceData[i];
        this.chart1 = [
          {
            name: 'Price Data',
            series: [
              {
                name: this.formatdate(this.priceData[i]?.date_time || this.priceData[i]?.date),
                value: this.priceData[i]?.total,
              },
            ],
          },
        ];
      }
      this.customerLifeTime = this.dashboardInfos?.customer_lifetime_value;
      for (let i = 0; i < this.customerLifeTime?.length; i++) {
        this.customerLineData = this.customerLifeTime[i];
        const date = this.formatdate(this.customerLineData?.date);
        const total = this.customerLineData?.total;
        const uniqueCustomers = this.customerLineData?.unique_customers;
        const value = total / uniqueCustomers;
        this.chart2 = [
          {
            name: 'Customer life time',
            series: [
              {
                name: this.formatdate(this.priceData[i]?.date_time),
                value: value,
              },
            ],
          },
        ];
      }

      this.serviceUtilizationData = this.dashboardInfos?.service_utilization_rate;
      for (let i = 0; i < this.serviceUtilizationData?.length; i++) {
        this.serviceUtilizationLineData = this.serviceUtilizationData[i];
        this.potential = this.serviceUtilizationLineData?.potential;
        let totalPrice = this.potential?.reduce(function (accumulator: any, item: any) {
          return accumulator + item?.capacity * item?.slot;
        }, 0);
        const value = this.serviceUtilizationData[i]?.bookings / totalPrice;
        this.chart3 = [
          {
            name: 'Service Utilization',
            value: value,
          },
        ];
      }
    });
  }

  onClickQtd() {
    const QTD = 'QTD';
    this.store.dispatch(getDashboardList({ filters: { filter_type: QTD } }));
  }

  onClickYtd() {
    const YTD = 'YTD';
    this.store.dispatch(getDashboardList({ filters: { filter_type: YTD } }));
  }

  onClickMtd() {
    this.store.dispatch(getDashboardList({ filters: {} }));
  }

  formatdate(date: any) {
    var newDate = new Date(date);
    const dates =
      newDate?.toLocaleDateString(undefined, { day: '2-digit' }) +
      ' ' +
      newDate?.toLocaleDateString(undefined, { month: 'short' });
    return dates;
  }

  isTomorrow(date: any) {
    const tomorrow = new Date();
    tomorrow?.setDate(tomorrow.getDate() + 1);
    let data = new Date(date);
    if (tomorrow?.toDateString() === data?.toDateString()) {
      return true;
    }

    return false;
  }

  isToday(someDate: any) {
    const today = new Date();
    let data = new Date(someDate);
    return (
      data?.getDate() + 1 == today?.getDate() + 1 &&
      data?.getMonth() == today?.getMonth() &&
      data?.getFullYear() == today?.getFullYear()
    );
  }

  getDayName(date: any) {
    const days = ['Sun', 'Mon', 'Tue', 'Wedn', 'Thu', 'Fri', 'Sat'];
    const d = new Date(date);
    const dayName = days[d.getDay()];
    return dayName;
  }

  navagateToBooking() {
    this.router.navigateByUrl('booking/view-booking');
  }

  ngOnDestroy(): void {
    this.ngUnsubscriber.next();
    this.ngUnsubscriber.complete();
  }

  onSelect(eve: any) {}

  onActivate(eve: any) {}

  onDeactivate(eve: any) {}
}
