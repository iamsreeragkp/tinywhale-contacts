import { Location } from '@angular/common';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { filter, map, Observable, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { addPayment, getPayment } from '../../../accounts/store/account.actions';
import { IAccountState } from '../../../accounts/store/account.reducers';
import { getPayments } from '../../../accounts/store/account.selectors';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.scss'],
})
export class AddPaymentComponent implements OnInit, OnDestroy {
  paymentForm!: FormGroup;
  ngUnsubscribe = new Subject<any>();
  editMode = false;
  paymentData$: Observable<any>;
  isSaving = false;
  isGettingStarted = false;
  defaultCurrencies = [
    {
      key: 'USD',
      value: 'USD',
    },
    {
      key: 'INR',
      value: 'INR',
    },
    {
      key: 'SGD',
      value: 'SGD',
    },
    {
      key: 'GBP',
      value: 'GBP',
    },
    {
      key: 'AUD',
      value: 'AUD',
    },
  ];

  constructor(
    private authService: AuthService,
    private store: Store<IAccountState>,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    public location: Location
  ) {
    this.paymentForm = this.createPaymentForm();
    this.paymentData$ = this.store.pipe(select(getPayments));
    route.url
      .pipe(
        takeUntil(this.ngUnsubscribe),
        map(urlSegments => urlSegments.some(url => url?.path.includes('edit-payment')))
      )
      .subscribe(editMode => {
        this.editMode = editMode;
        if (editMode) {
          this.zone.run(() => {
            setTimeout(() => {
              this.store.dispatch(getPayment());
            }, 1000);
          });
        }
      });
    this.isGettingStarted = this.router.url.split('/').includes('home');
  }

  ngOnInit(): void {
    this.initializePaymentForm();
    this.subscriptions();
  }

  subscriptions() {
    this.paymentData$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(val => !!val)
      )
      .subscribe(data => {
        if (data) {
          this.initializePaymentForm(data);
        } else {
          console.log(data?.error);
        }
      });
  }

  initializePaymentForm(val?: any) {
    if (!val) {
      return;
    }
    this.paymentForm = new FormGroup({
      company: new FormControl(val?.type),
      companyname: new FormControl(val?.business_name),
      addressline1: new FormControl(val?.address_line_1),
      addressline2: new FormControl(val?.address_line_2),
      postelcode: new FormControl(val?.postal_code),
      city: new FormControl(val?.city),
      state: new FormControl(val?.state),
      country: new FormControl(val?.country),
      currency: new FormControl(val?.default_currency),
    });
  }

  createPaymentForm() {
    return new FormGroup({
      company: new FormControl(''),
      companyname: new FormControl(''),
      addressline1: new FormControl(''),
      addressline2: new FormControl(''),
      postelcode: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      country: new FormControl(''),
      currency: new FormControl(''),
    });
  }

  onSubmitPayment() {
    this.isSaving = true;
    const userData = this.authService.decodeUserToken();
    const {
      dashboardInfos: { businessId: business_id },
    } = userData;
    const {
      company,
      companyname,
      addressline1,
      addressline2,
      postelcode,
      city,
      state,
      country,
      currency,
    } = this.paymentForm.value;

    const paymentPayload = {
      business_id: business_id,
      business_name: companyname,
      type: company,
      address_line_1: addressline1,
      address_line_2: addressline2,
      city: city,
      state: state,
      country: country,
      postal_code: parseInt(postelcode),
      default_currency: currency,
      beneficiary_id: '4343342323',
    };
    this.store.dispatch(addPayment({ paymentData: paymentPayload }));
    this.isSaving = false;
    // this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.complete();
    this.ngUnsubscribe.next(true);
  }
}