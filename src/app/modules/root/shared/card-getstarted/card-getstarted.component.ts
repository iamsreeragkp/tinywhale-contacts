import { Component, OnInit } from '@angular/core';
import { RootService } from '../../root.service';

@Component({
  selector: 'app-card-getstarted',
  templateUrl: './card-getstarted.component.html',
  styleUrls: ['./card-getstarted.component.scss'],
})
export class CardGetstartedComponent implements OnInit {
  constructor(private rootService: RootService) {}

  isBusinessAvailable = false;
  isPaymentAvailable = false;
  isServiceAvailable = false;

  isBusinessInfoStarted: any;
  isBusinessInfoCompleted: any;
  isPaymentInfoCompleted: any;
  isPaymentInfoStarted: any;
  isServiceInfoCompleted: any;
  isServiceInfoStarted: any;

  ngOnInit(): void {
    this.getUserBusinessInfo();
  }

  getUserBusinessInfo() {
    const userData = this.rootService.decodeUserToken();

    this.isBusinessInfoStarted = userData?.dashboardInfos?.businessInfo?.isStarted;
    this.isBusinessInfoCompleted = userData?.dashboardInfos?.businessInfo?.isCompleted;

    this.isPaymentInfoCompleted = userData?.dashboardInfos?.paymentInfo?.isCompleted;
    this.isPaymentInfoStarted = userData?.dashboardInfos?.paymentInfo?.isStarted;

    this.isServiceInfoCompleted = userData?.dashboardInfos?.serviceInfo?.isCompleted;
    this.isServiceInfoStarted = userData?.dashboardInfos?.serviceInfo?.isStarted;
  }
}
