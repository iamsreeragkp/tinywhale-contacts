import { Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
} from '@angular/forms';
import { IAngularMyDpOptions, IMyDate } from 'angular-mydatepicker';

@Component({
  selector: 'app-select-calendar',
  templateUrl: './select-calendar.component.html',
  styleUrls: ['./select-calendar.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectCalendarComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SelectCalendarComponent),
      multi: true,
    },
  ],
})
export class SelectCalendarComponent {
  date: any;
  showOverlay = false;
  _isDisabled: boolean = false;
  @Input() placeholder = 'Select Date';
  @Input() set disableDates(val: IMyDate[]) {
    this.myDatePickerOptions = {
      ...this.myDatePickerOptions,
      disableDates: val,
    };
  }
  @Input() set disableWeekdays(val: string[]) {
    this.myDatePickerOptions = {
      ...this.myDatePickerOptions,
      disableWeekdays: val,
    };
  }
  @Input() set disableUntil(val: Date) {
    this.myDatePickerOptions = {
      ...this.myDatePickerOptions,
      disableUntil: { day: val.getDate(), month: val.getMonth() + 1, year: val.getFullYear() },
    };
  }
  // options = {
  //   format: 'yyyy-MM-dd',
  //   placeholder: 'Session 1',
  // };

  myDatePickerOptions: IAngularMyDpOptions = {
    showSelectorArrow: false,
    dayLabels: { su: 'S', mo: 'M', tu: 'T', we: 'W', th: 'T', fr: 'F', sa: 'S' },
    monthLabels: {
      1: 'January',
      2: 'February',
      3: 'March',
      4: 'April',
      5: 'May',
      6: 'June',
      7: 'July',
      8: 'August',
      9: 'September',
      10: 'October',
      11: 'November',
      12: 'December',
    },
    firstDayOfWeek: 'su',
    sunHighlight: false,
    showMonthNumber: false,
    dateFormat: 'dd mmm',
    focusInputOnDateSelect: false,
  };

  constructor() {}

  setPreviousValues(val: any) {
    if (val instanceof Date) {
      this.date = {
        singleDate: {
          jsDate: val,
        },
      };
    } else {
      this.date = undefined;
    }
  }

  _onChange = (val: any) => {};
  _onTouched = () => {};
  _validate: (control: AbstractControl) => ValidationErrors | null = control => null;

  writeValue(val: any) {
    this.setPreviousValues(val);
  }

  registerOnChange(fn: () => any) {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => any) {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this._isDisabled = isDisabled;
  }

  validate(validatorFn: (control: AbstractControl) => ValidationErrors | null) {
    this._validate = validatorFn;
  }

  updateDate(val: any) {
    if (this._isDisabled) {
      return;
    }
    this.date = val;
    if (val?.singleDate?.jsDate instanceof Date) {
      const newDate = new Date(this.date.singleDate.jsDate);
      newDate.setMinutes(-newDate.getTimezoneOffset());
      console.log(newDate);
      this._onChange(newDate);
    } else {
      this._onChange(null);
    }
  }

  calendarOpenChanged(val: number) {
    this.showOverlay = val === 1;
    if (val === 4) {
      this._onTouched();
    }
  }
}
