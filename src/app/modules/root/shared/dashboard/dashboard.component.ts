import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { convert24HrsFormatToAmPm, Currency, currencyList } from 'src/app/shared/utils';
import { environment } from 'src/environments/environment';
import { getDashboard, getDashboardList } from '../../store/root.actions';
import { IRootState } from '../../store/root.reducers';
import { getDashboardData } from '../../store/root.selectors';
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
  copyView: any = null;
  copyStatus: string = 'Copy';
  copyURL: string = '';
  customUsername!: string;
  baseURL = environment.tinyWhaleBaseUrl;
  overviewType: string = 'MTD';

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
  customerCurrency?: Currency;
  ngUnsubscribe = new Subject<any>();
  val: any;

  constructor(private store: Store<IRootState>, private router: Router, authService: AuthService) {
    const userData = authService.decodeUserToken();
    this.customerCurrency = currencyList.find(
      currency => currency.id === userData?.dashboardInfos?.default_currency
    );
    this.dashboard$ = store.pipe(
      select(getDashboardData),
      takeUntil(this.ngUnsubscribe),
      filter(val => !!val)
    );

    this.store.dispatch(getDashboard({ filters: {} }));
    this.dashboard$ = store.pipe(select(getDashboardData));
  }

  ngOnInit(): void {
    this.subscriptions();
  }
  currentMonthGross: any;
  bookingGross: any;
  fromLastMonthProcessGross: any;
  currentTotal: any;
  lastTotal: any;
  average: any;
  processingFee: any;
  startTime: any;
  endTime: any;
  classTimeRanged: any;
  subscriptions() {
    this.dashboard$.pipe(takeUntil(this.ngUnsubscriber)).subscribe(data => {
      this.dashboardInfos = data;
      const fromCurrentMonth = this.dashboardInfos?.gross_earnings?.current_month;
      const fromLastMonth = this.dashboardInfos?.gross_earnings?.last_month;
      this.currentMonthGross = fromCurrentMonth - fromLastMonth;

      const fromCurrentMonthBooking = this.dashboardInfos?.bookings?.current_month;
      const fromLastMonthBooking = this.dashboardInfos?.bookings?.last_month;
      this.bookingGross = fromCurrentMonthBooking - fromLastMonthBooking;

      const getewayFeeCurrent =
        this.dashboardInfos?.processing_fee?.current_month?.gateway_fee || 0;

      const paymentFeeCurrent =
        this.dashboardInfos?.processing_fee?.current_month?.payment_amount || 0;

      const processFeeCurrent =
        this.dashboardInfos?.processing_fee?.current_month?.platform_fee || 0;

      const getewayFeeLast = this.dashboardInfos?.processing_fee?.last_month?.gateway_fee || 0;

      const paymentFeeLast = this.dashboardInfos?.processing_fee?.last_month?.payment_amount || 0;

      const processFeeLast = this.dashboardInfos?.processing_fee?.last_month?.platform_fee || 0;

      this.currentTotal = getewayFeeCurrent + paymentFeeCurrent + processFeeCurrent;

      this.lastTotal = getewayFeeLast + paymentFeeLast + processFeeLast;

      const sum = this.currentTotal + this.lastTotal;
      // console.log('sum', sum);
      if (this.currentTotal < this.lastTotal) {
        const diff1 = this.lastTotal - this.currentTotal;
        this.percentage = (diff1 * 100) / this.lastTotal;
      } else if (this.currentTotal > this.lastTotal) {
        const diff2 = this.currentTotal - this.lastTotal;
        if (!this.lastTotal) {
          this.percentage = diff2;
        } else {
          this.percentage = 0;
        }
      }

      //                      Gateway Fee + TinyWhale Fee
      // Processing Fee % = ----------------------------- x 100
      //                        Total Payment Amount

      const sumOfGatewayAndProcessingFee = getewayFeeCurrent + processFeeCurrent;
      this.processingFee = (sumOfGatewayAndProcessingFee / paymentFeeCurrent) * 100;

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

        const totalPrice = this.potential?.reduce(function (accumulator: any, item: any) {
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

  onClickQtd(type: string) {
    this.overviewType = type;
    this.store.dispatch(getDashboard({ filters: { filter_type: this.overviewType } }));
  }

  onClickYtd(type: string) {
    this.overviewType = type;
    this.store.dispatch(getDashboard({ filters: { filter_type: this.overviewType } }));
  }

  onClickMtd(type: string) {
    this.overviewType = type;
    this.store.dispatch(getDashboard({ filters: {} }));
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
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const d = new Date(date);
    const dayName = days[d.getDay()];
    return dayName;
  }

  navagateToBooking() {
    this.router.navigate(['booking/view-booking'], {
      queryParams: { filter: 'upcoming' },
    });
  }
  navagateToService() {
    this.router.navigateByUrl('/service/home');
  }
  convert24HrsFormatToAmPm(time?: string | null) {
    if (!time) {
      return '';
    }
    const [endHour, minute] = time.match(/\d{2}/g)!;
    let amPm = 'AM';
    let hour = endHour;
    if (+endHour >= 12) {
      amPm = 'PM';
    }
    if (+endHour > 12) {
      hour = (+endHour - 12).toString().padStart(2, '0');
    } else if (+endHour === 0) {
      hour = '12';
    }
    return `${hour}:${minute} ${amPm}`;
  }

  copyViewBox() {
    this.copyView = !this.copyView;
    this.copyStatus = 'Copy';
    this.copyURL = `${this.baseURL + '/' + this.dashboardInfos.customUsername}`;
  }

  copyInputMessage(inputElement: any) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.copyStatus = 'Copied';
  }

  ngOnDestroy(): void {
    this.ngUnsubscriber.next();
    this.ngUnsubscriber.complete();
  }

  onSelect(eve: any) {}

  onActivate(eve: any) {}

  onDeactivate(eve: any) {}
}
