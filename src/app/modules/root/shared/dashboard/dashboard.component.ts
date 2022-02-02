import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Observable, Subject, takeUntil } from 'rxjs';
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

  onSelect(eve: any) {}

  onActivate(eve: any) {}

  onDeactivate(eve: any) {}
}
