import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { IRootState } from '../../store/root.reducers';
import { getDashboardData } from '../../store/root.selectors';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-card-getstarted',
  templateUrl: './card-getstarted.component.html',
  styleUrls: ['./card-getstarted.component.scss'],
})
export class CardGetstartedComponent implements OnInit, OnDestroy {
  dashboard$: Observable<any>;
  ngUnsubscriber = new Subject<void>();
  dashboardInfos: any = undefined;
  showPortal = false;
  baseURL= environment.tinyCardURL;
  iframeURL:any;
  @ViewChild('openWindow', { static: false }) openWindow:any;
  constructor(private store: Store<IRootState>, private sanitizer: DomSanitizer) {
    this.dashboard$ = store.pipe(select(getDashboardData),
    );
  }

  ngOnInit(): void {
    this.subscriptions();
  }

  subscriptions() {
    this.dashboard$.pipe(takeUntil(this.ngUnsubscriber)).subscribe(data => {
      this.dashboardInfos = data; 
    });
    
  }

  iframeOpen(type:any){
    // // this.showPortal = false;
    if (type === "publishTinyCard") {
      this.iframeURL = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.baseURL+'/'+this.dashboardInfos.domainName}`);
    }
    else{   
      this.iframeURL = this.sanitizer.bypassSecurityTrustResourceUrl(`${this.baseURL}/preview`);
    }
    this.openWindow.openDialog();
    this.showPortal = true;
  }

  isCompleted(){                                                                                                                       
    return ( !this.dashboardInfos?.businessInfo?.isCompleted || !this.dashboardInfos?.serviceInfo?.isCompleted || !this.dashboardInfos?.paymentInfo?.isCompleted)
  }

  ngOnDestroy(): void {
    this.ngUnsubscriber.next();
    this.ngUnsubscriber.complete();
  }
}
