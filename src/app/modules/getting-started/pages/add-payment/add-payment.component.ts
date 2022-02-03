import { Location } from '@angular/common';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { filter, map, Observable, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { countryList, currencyList } from 'src/app/shared/utils';
import { addKyc, addPayment, getPayment } from '../../../accounts/store/account.actions';
import { IAccountState } from '../../../accounts/store/account.reducers';
import { getAccountInfo, getKycInfo, getPayments } from '../../../accounts/store/account.selectors';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.scss'],
})
export class AddPaymentComponent implements OnInit, OnDestroy {
  paymentForm!: FormGroup;
  ngUnsubscribe = new Subject<any>();
  unSubscribeAccountType = new Subject<void>();
  editMode = false;
  paymentData$: Observable<any>;
  isSaving = false;
  isGettingStarted = false;
  defaultCurrencies = currencyList;
  countryList = countryList;

  checkedInfo = true;

  constructor(
    private authService: AuthService,
    private store: Store<IAccountState>,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    public location: Location
  ) {
    this.paymentForm = this.createPaymentForm();
    this.subscribeAccountTypeChange();
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

  idStatus = false;

  subscriptions() {
    this.paymentData$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(val => !!val)
      )
      .subscribe(data => {
        if (data) {
          console.log(data);
          this.initializePaymentForm(data);
          if (data?.payout_info?.beneficiary_id) {
            this.idStatus = true;
            this.store.dispatch(addKyc());
          }
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
      firstname: new FormControl(val?.first_name),
      lastname: new FormControl(val?.last_name),
      addressline1: new FormControl(val?.address_line_1),
      addressline2: new FormControl(val?.address_line_2),
      postelcode: new FormControl(val?.postal_code),
      city: new FormControl(val?.city),
      state: new FormControl(val?.state),
      country: new FormControl(val?.country),
      currency: new FormControl(val?.default_currency),
    });
    this.subscribeAccountTypeChange();
  }

  createPaymentForm() {
    return new FormGroup({
      company: new FormControl(''),
      companyname: new FormControl(''),
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      addressline1: new FormControl('', Validators.required),
      addressline2: new FormControl('', Validators.required),
      postelcode: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      country: new FormControl(''),
      currency: new FormControl(''),
    });
  }

  subscribeAccountTypeChange() {
    this.unSubscribeAccountType.next();
    this.paymentForm
      .get('company')
      ?.valueChanges.pipe(takeUntil(this.unSubscribeAccountType))
      .subscribe(val => {
        if (val === 'INDIVIDUAL') {
          this.paymentForm.get('firstname')?.enable();
          this.paymentForm.get('lastname')?.enable();
          this.paymentForm.get('companyname')?.disable();
        } else {
          this.paymentForm.get('firstname')?.disable();
          this.paymentForm.get('lastname')?.disable();
          this.paymentForm.get('companyname')?.enable();
        }
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
      firstname,
      lastname,
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
      first_name: firstname,
      last_name: lastname,
      type: company,
      address_line_1: addressline1,
      address_line_2: addressline2,
      city: city,
      state: state,
      country: country,
      postal_code: parseInt(postelcode),
      default_currency: currency,
    };
    this.store.dispatch(addPayment({ paymentData: paymentPayload }));
    this.isSaving = false;
    this.router.navigate(['/']);
  }

  onConnectBank() {
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

    const rapidPayload = {
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
      connect_rapyd: true,
    };
    if (this.idStatus) {
      this.store.dispatch(addKyc());
    } else {
      this.store.dispatch(addPayment({ paymentData: rapidPayload }));
    }
  }

  onUpdateBank() {
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

    const rapidPayload = {
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
      connect_rapyd: true,
    };
    this.store.dispatch(addPayment({ paymentData: rapidPayload }));
  }

  onChangeData(event: any) {
    if (event?.target?.checked === true) {
      this.checkedInfo = false;
    } else {
      this.checkedInfo = true;
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.complete();
    this.ngUnsubscribe.next(true);
  }
}
