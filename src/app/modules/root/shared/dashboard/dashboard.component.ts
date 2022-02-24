import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/auth.service';
import {
  Currency,
  currencyList,
  getDaysInAMonth,
  getNextOrPrevious12Months,
  getQuarterMonths,
} from 'src/app/shared/utils';
import { environment } from 'src/environments/environment';
import { getDashboard } from '../../store/root.actions';
import { IRootState } from '../../store/root.reducers';
import { getDashboardData } from '../../store/root.selectors';
import { multi, single } from './data';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend,
  ApexFill,
  ApexGrid,
  ApexMarkers,
  ApexTooltip,
  ApexPlotOptions,
} from 'ng-apexcharts';
import { DatePipe } from '@angular/common';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  labels: string[];
  legend: ApexLegend;
  subtitle: ApexTitleSubtitle;
  fill: ApexFill;
  colors: any[];
  grid: ApexGrid;
  markers: ApexMarkers;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DatePipe],
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('chart') chart?: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions>;
  public chartOptions3: Partial<ChartOptions>;

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
  chart1!: ApexAxisChartSeries;
  chart2!: ApexAxisChartSeries;
  chart3!: ApexAxisChartSeries;
  percentage: any;
  copyView: any = null;
  copyStatus: string = 'Copy';
  copyURL: string = '';
  customUsername!: string;
  baseURL = environment.tinyWhaleBaseUrl;
  overviewType: string = 'MTD';

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
  chart1Labels: any[] = [];

  constructor(
    private store: Store<IRootState>,
    private router: Router,
    authService: AuthService,
    private datePipe: DatePipe
  ) {
    this.chartOptions = {
      // series: [
      //   {
      //     name: '',
      //     data: series.monthDataSeries1.prices,
      //   },
      // ],
      chart: {
        type: 'area',
        height: '100%',
        width: '100%',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ['#00a4b7'],
      fill: {
        colors: ['#1addf37a'],
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.9,
          opacityTo: 0.8,
          stops: [0, 100],
        },
      },
      markers: {
        colors: ['#00a4b7'],
      },

      dataLabels: {
        enabled: true,
        formatter(val) {
          return '.';
        },
        style: {
          fontSize: '6px',
          colors: ['#00a4b7'],
        },
        background: {
          enabled: true,
          borderRadius: 6,
          padding: 3,
          foreColor: '#00a4b7',
          borderWidth: 0,
        },
      },
      stroke: {
        curve: 'straight',
        colors: ['#00a4b7'],
        width: 3,
      },
      yaxis: {
        show: true,
        labels: {
          show: true,
          style: {
            fontSize: '12px',
            colors: '#73959d',
            fontFamily: 'poppins',
          },
        },
      },
      xaxis: {
        offsetX: 4,
        labels: {
          show: true,
          style: {
            fontSize: '12px',
            colors: '#73959d',
            fontFamily: 'poppins',
          },
        },
      },
      legend: {
        show: false,
      },
      // labels: series.monthDataSeries1.dates,
    };

    this.chartOptions2 = {
      // series: [
      //   {
      //     name: '',
      //     data: series.monthDataSeries1.prices,
      //   },
      // ],
      chart: {
        type: 'area',
        height: '100%',
        width: '100%',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ['e1c700'],
      fill: {
        colors: ['#e7d14494'],
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.9,
          opacityTo: 0.8,
          stops: [0, 100],
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        colors: ['#e1c700'],
        width: 3,
      },
      yaxis: {
        show: false,
      },
      xaxis: {
        labels: {
          show: false,
        },
      },
      legend: {
        show: false,
      },
      grid: {
        show: false,
      },
    };

    this.chartOptions3 = {
      // series: [
      //   {
      //     name: 'TEAM A',
      //     type: 'column',
      //     data: series.monthDataSeries1.prices,
      //   },
      //   {
      //     name: 'TEAM B',
      //     type: 'area',
      //     data: series.monthDataSeries1.prices,
      //   },
      // ],
      chart: {
        type: 'line',
        stacked: false,
        height: '100%',
        width: '100%',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      stroke: {
        width: [0],
        curve: 'smooth',
        colors: ['transparent'],
      },
      colors: ['#ED9F7C'],
      fill: {
        colors: ['#ED9F7C', '#FDF5F2'],
      },
      dataLabels: {
        enabled: false,
      },
      yaxis: {
        show: false,
      },
      xaxis: {
        labels: {
          show: false,
        },
      },
      legend: {
        show: false,
      },
      grid: {
        show: false,
      },
    };
    this.initializeCharts();

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

  initializeCharts() {
    this.chart1 = [{ name: '', data: [] }];
    this.chart1Labels = [];
    this.chart2 = [{ name: '', data: [] }];
    this.chart3 = [
      { name: '', data: [], type: 'column' },
      { name: '', data: [], type: 'area' },
    ];
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
      const fromCurrentMonth = this.getFieldValue('current', this.dashboardInfos?.gross_earnings);
      const fromLastMonth = this.getFieldValue('last', this.dashboardInfos?.gross_earnings);
      this.currentMonthGross = fromCurrentMonth - fromLastMonth;

      const fromCurrentMonthBooking = this.getFieldValue('current', this.dashboardInfos?.bookings);
      const fromLastMonthBooking = this.getFieldValue('last', this.dashboardInfos?.bookings);
      this.bookingGross = fromCurrentMonthBooking - fromLastMonthBooking;

      const getewayFeeCurrent =
        this.getFieldValue('current', this.dashboardInfos?.processing_fee)?.gateway_fee || 0;

      const paymentFeeCurrent =
        this.getFieldValue('current', this.dashboardInfos?.processing_fee)?.payment_amount || 0;

      const processFeeCurrent =
        this.getFieldValue('current', this.dashboardInfos?.processing_fee)?.platform_fee || 0;

      const getewayFeeLast =
        this.getFieldValue('last', this.dashboardInfos?.processing_fee)?.gateway_fee || 0;

      const paymentFeeLast =
        this.getFieldValue('last', this.dashboardInfos?.processing_fee)?.payment_amount || 0;

      const processFeeLast =
        this.getFieldValue('last', this.dashboardInfos?.processing_fee)?.platform_fee || 0;

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

      /**
       *                      Gateway Fee + TinyWhale Fee
       *  Processing Fee % = ----------------------------- x 100
       *                          Total Payment Amount
       */

      const sumOfGatewayAndProcessingFee = getewayFeeCurrent + processFeeCurrent;
      this.processingFee = (sumOfGatewayAndProcessingFee / paymentFeeCurrent) * 100;

      this.priceData = this.dashboardInfos?.price_data;
      this.upcomingSessions = this.dashboardInfos?.upcoming_sessions;
      this.populateChartData();
    });
  }

  populateChartData() {
    let datesArray: string[] = [];
    if (this.overviewType === 'MTD') {
      datesArray.push(...getDaysInAMonth());
    } else if (this.overviewType === 'QTD') {
      datesArray.push(...getQuarterMonths());
    } else if (this.overviewType === 'YTD') {
      const startMonth = this.priceData.reduce(
        (startMonth: string, lineItem: any) =>
          +new Date(startMonth) > +new Date(lineItem.date) ? lineItem.date : startMonth,
        this.priceData?.[0]?.date ?? new Date().toISOString()
      );
      datesArray.push(...getNextOrPrevious12Months('previous', startMonth));
    } else {
      return;
    }
    this.initializeCharts();
    for (let [i, date] of datesArray.entries()) {
      this.chart1.forEach(chart =>
        chart.data.push(
          this.priceData?.reduce((total: any, priceLineItem: any) => {
            const formattedDate = this.getFormattedDateOfPreviewType(priceLineItem);
            if (date === formattedDate) {
              total += +priceLineItem?.total;
            }
            return total;
          }, 0)
        )
      );
      if (this.overviewType !== 'MTD' || i % 7 === 0 || i % 7 === 3) {
        this.chart1Labels.push(date);
      } else {
        this.chart1Labels.push('');
      }
    }
    // for (let i = 0; i < this.priceData?.length; i++) {
    //   this.priceLineData = this.priceData[i];
    //   this.chart1.map(chart => chart.data.push(this.priceData[i]?.total));
    //   this.chart1Labels.push(
    //     this.formatdate(this.priceData[i]?.date_time || this.priceData[i]?.date)
    //   );
    //   // this.chart1 = [
    //   //   {
    //   //     name: 'Price Data',
    //   //     series: [
    //   //       {
    //   //         name: this.formatdate(this.priceData[i]?.date_time || this.priceData[i]?.date),
    //   //         value: this.priceData[i]?.total,
    //   //       },
    //   //     ],
    //   //   },
    //   // ];
    // }
    this.customerLifeTime = this.dashboardInfos?.customer_lifetime_value;
    this.serviceUtilizationData = this.dashboardInfos?.service_utilization_rate;
    console.log(this.customerLifeTime);
    console.log(this.serviceUtilizationData);
    const previous12Months = getNextOrPrevious12Months('previous');
    for (let month of previous12Months) {
      this.chart2.forEach(chart =>
        chart.data.push(
          this.customerLifeTime?.reduce((val: number, lifeTimeData: any) => {
            if (month === this.datePipe.transform(lifeTimeData.date, 'MMM yyyy')) {
              val += +(+lifeTimeData?.total / +lifeTimeData?.unique_customers).toFixed(2);
            }
            return val;
          }, 0)
        )
      );
      this.chart3.forEach(chart =>
        chart.data.push(
          this.serviceUtilizationData?.reduce((val: number, utilData: any) => {
            if (month === this.datePipe.transform(utilData.date, 'MMM yyyy')) {
              const potential = utilData?.potential;
              const totalPrice = potential?.reduce(function (accumulator: any, item: any) {
                return accumulator + item?.capacity * item?.slot;
              }, 0);
              val += +(+utilData?.bookings / +totalPrice).toFixed(2);
            }
            return val;
          }, 0)
        )
      );
    }
    // for (let i = 0; i < this.customerLifeTime?.length; i++) {
    //   this.customerLineData = this.customerLifeTime[i];
    //   const date = this.formatdate(this.customerLineData?.date);
    //   const total = this.customerLineData?.total;
    //   const uniqueCustomers = this.customerLineData?.unique_customers;
    //   const value: any = total / uniqueCustomers;
    //   this.chart2.map(chart => chart.data.push(value));
    //   // this.chart2 = [
    //   //   {
    //   //     name: 'Customer life time',
    //   //     series: [
    //   //       {
    //   //         name: this.formatdate(this.priceData[i]?.date_time),
    //   //         value: value,
    //   //       },
    //   //     ],
    //   //   },
    //   // ];
    // }

    // for (let i = 0; i < this.serviceUtilizationData?.length; i++) {
    //   this.serviceUtilizationLineData = this.serviceUtilizationData[i];

    //   this.potential = this.serviceUtilizationLineData?.potential;

    //   const totalPrice = this.potential?.reduce(function (accumulator: any, item: any) {
    //     return accumulator + item?.capacity * item?.slot;
    //   }, 0);

    //   const value: any = this.serviceUtilizationData[i]?.bookings / totalPrice;
    //   this.chart3.map(chart => chart.data.push(value));
    //   // this.chart3 = [
    //   //   {
    //   //     name: 'Service Utilization',
    //   //     value: value,
    //   //   },
    //   // ];
    // }
  }

  togglePeriod(type?: string) {
    this.overviewType = type ?? 'MTD';
    this.store.dispatch(getDashboard({ filters: { ...(!!type && { filter_type: type }) } }));
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

  navagateToBooking(filter: any) {
    this.router.navigate(['booking/view-booking'], {
      queryParams: filter,
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

  getFieldValue(currentOrPrevious: 'current' | 'last', obj: any) {
    let returnVal = null;
    if (this.overviewType === 'MTD') {
      returnVal = obj?.[`${currentOrPrevious}_month`];
    } else if (this.overviewType === 'QTD') {
      returnVal = obj?.[`${currentOrPrevious}_quarter`];
    } else if (this.overviewType === 'YTD') {
      returnVal = obj?.[`${currentOrPrevious}_year`];
    }
    return returnVal;
  }

  getFormattedDateOfPreviewType(priceLineItem: { date_time?: string; date: string }) {
    let returnVal = null;
    if (this.overviewType === 'MTD') {
      returnVal = this.datePipe.transform(priceLineItem.date_time, 'd MMM, yyyy');
    } else if (this.overviewType === 'QTD') {
      returnVal = this.datePipe.transform(priceLineItem.date, 'MMMM');
    } else if (this.overviewType === 'YTD') {
      returnVal = this.datePipe.transform(priceLineItem.date, 'MMM yyyy');
    }
    return returnVal;
  }

  onSelect(eve: any) {}

  onActivate(eve: any) {}

  onDeactivate(eve: any) {}
}
