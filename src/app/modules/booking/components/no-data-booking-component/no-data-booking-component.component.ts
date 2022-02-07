import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subject, takeUntil } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { getDashboardData } from '../../../root/store/root.selectors';
import { environment } from 'src/environments/environment';
import { IRootState } from 'src/app/modules/root/store/root.reducers';

@Component({
  selector: 'app-no-data-booking-component',
  templateUrl: './no-data-booking-component.component.html',
  styleUrls: ['./no-data-booking-component.component.scss']
})
export class NoDataBookingComponentComponent implements OnInit {

  dashboard$: Observable<any>;
  ngUnsubscriber = new Subject<void>();
  dashboardInfos: any = undefined;
  showPortal = false;
  baseURL= environment.tinyCardURL;
  iframeURL:any;
  @ViewChild('openWindow', { static: false }) openWindow:any;
  constructor(private store: Store<IRootState>, private sanitizer: DomSanitizer) { 
    this.dashboard$ = store.pipe(select(getDashboardData));
  }
  

  ngOnInit(): void {
    this.subscriptions();
  }

  subscriptions() {
    this.dashboard$.pipe(takeUntil(this.ngUnsubscriber)).subscribe(data => {
      console.log("DATA",data);
      
      this.dashboardInfos = data; 
    }, err=> {
      console.log("ERROR OCCURED",err);
      
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

  hasStarted()
  {                                                                                       
    return ( this.dashboardInfos?.businessInfo?.isStarted || this.dashboardInfos?.serviceInfo?.isStarted || this.dashboardInfos?.paymentInfo?.isStarted)
  }

  ngOnDestroy(): void {
    this.ngUnsubscriber.next();
    this.ngUnsubscriber.complete();
  }

}
