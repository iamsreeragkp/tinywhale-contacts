import { Component, Input, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { countryList, escapeRegex } from '../../utils';

@Component({
  selector: 'app-phone-number-input',
  templateUrl: './phone-number-input.component.html',
  styleUrls: ['./phone-number-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PhoneNumberInputComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: PhoneNumberInputComponent,
      multi: true,
    },
  ],
})
export class PhoneNumberInputComponent implements OnDestroy {
  phoneNumber: FormGroup;
  _isDisabled = false;
  ngUnsubscriber$ = new Subject<void>();
  @Input() set disabled(val: boolean) {
    this.setDisabledState(val);
  }

  constructor(fb: FormBuilder) {
    this.phoneNumber = fb.group({
      code: [null],
      number: [null, Validators.pattern(/^\d{8,15}$/)],
    });
    this.subscribeFields();
  }

  setPhoneNumber(val: string | null) {
    if (val) {
      const countryCodeObj = countryList.find(country => escapeRegex(`${country.code}`).test(val));
      if (countryCodeObj) {
        this.phoneNumber.get('code')?.patchValue(countryCodeObj.code);
        this.phoneNumber.get('number')?.patchValue(val.replace(countryCodeObj.code, ''));
        return;
      }
    }
    this.phoneNumber.get('code')?.patchValue(null);
    this.phoneNumber.get('number')?.patchValue(null);
  }

  subscribeFields() {
    this.phoneNumber.valueChanges.pipe(takeUntil(this.ngUnsubscriber$)).subscribe(val => {
      this._onChange(`${val.code ?? ''}${val.number ?? ''}`);
      if (this.phoneNumber.touched) {
        this._onTouched();
      }
    });
  }

  _onChange = (val: any) => {};
  _onTouched = () => {};

  writeValue(val: string | null) {
    this.setPhoneNumber(val);
  }

  registerOnChange(fn: () => any) {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => any) {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    if (isDisabled) {
      this.phoneNumber.disable();
    } else {
      this.phoneNumber.enable();
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    console.log(control);
    return this.phoneNumber.valid ? null : { invalid: true };
  }

  get countryCodeList() {
    return countryList;
  }

  ngOnDestroy(): void {
    this.ngUnsubscriber$.next();
    this.ngUnsubscriber$.complete();
  }
}
