import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { IAppState } from 'src/app/modules/core/reducers';
import { UtilsHelperService } from 'src/app/modules/core/services/utils-helper.service';
import { OptionsType } from 'src/app/shared/interfaces/dropdown.interface';
import { timeOptions } from 'src/app/shared/utils';
import { ServiceService } from '../../service.service';
import {
  PricePackage,
  Product,
  ProductPhoto,
  TimeRange,
  WeekDay,
} from '../../shared/service.interface';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss'],
})
export class AddServiceComponent implements OnInit {
  productForm: FormGroup = new FormGroup({});
  locationOptions: OptionsType = [
    { id: 'CUSTOMER_LOCATION', type: 'CUSTOMER_LOCATION', label: "Customer's Location" },
    { id: 'ONLINE', type: 'ONLINE', label: 'Online (Zoom - connect)' },
  ];
  // generating time options
  timeOptions = timeOptions;
  weekDayOptions = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ].map(weekDay => ({
    value: WeekDay[weekDay as keyof typeof WeekDay],
    label: weekDay,
    selected: false,
  }));
  ngUnsubscriber = new Subject<void>();
  startTimeUnsubscriber$ = new Subject<void>();

  constructor(
    private store: Store<IAppState>,
    private _fb: FormBuilder,
    private productService: ServiceService,
    private utilsService: UtilsHelperService
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    this.subscriptions();
  }

  subscriptions() {
    this.productForm
      .get('duration')
      ?.valueChanges.pipe(takeUntil(this.ngUnsubscriber))
      .subscribe(duration => {
        this.timeRanges.controls.forEach(timeRange => this.updateEndTime(timeRange, duration));
      });
  }

  initForms(val?: Product) {
    this.productForm = this._fb.group({
      product_type: [val?.product_type ?? null, Validators.required],
      title: [val?.title ?? null],
      description: [val?.description ?? null],
      price: [val?.price ?? null],
      currency: [val?.currency ?? null],
      visibility: [val?.visibility ?? null],
      photos: this._fb.array(
        val?.photos?.length
          ? val.photos.map(photo => this.createPhotos(photo))
          : Array.from({ length: 3 }, _ => this.createPhotos())
      ),
      location: [val?.class?.business_location ?? null],
      price_package: this._fb.array(
        val?.class?.class_packages?.length
          ? val.class.class_packages.map(pkg => this.createPricePackages(pkg))
          : [this.createPricePackages()]
      ),
      time_ranges: this._fb.array(
        val?.class?.class_time_ranges?.length
          ? val.class.class_time_ranges.map(time_range => this.createTimeRanges(time_range))
          : []
      ),
      capacity: [val?.class?.capacity ?? null, Validators.pattern(/^[0-9]$/)],
      duration: [val?.class?.duration_in_minutes ?? null],
    });
    if (val?.product_id) {
      this.productForm.addControl('product_id', this._fb.control([val.product_id]));
    }
  }

  createPhotos(val?: ProductPhoto) {
    return this._fb.group({
      photo_url: [val?.photo_url ?? ''],
      photo_data_url: [{ value: val?.photo_url ?? '', disabled: true }],
      photo_file: [{ value: null, disabled: true }],
    });
  }

  createTimeRanges(val?: TimeRange) {
    if (val?.day_of_week) {
      this.weekDayOptions.find(weekDay => weekDay.value === val.day_of_week)!.selected = true;
    }
    return this._fb.group({
      day_of_week: [val?.day_of_week ?? null, [Validators.pattern(/^[1-7]$/)]],
      start_time: [val?.start_time ?? ''],
      end_time: [val?.end_time ?? ''],
      end_time_label: [{ value: this.createEndTimeLabel(val?.end_time), disabled: true }],
    });
  }

  createPricePackages(val?: PricePackage) {
    return this._fb.group({
      price: [val?.price ?? null],
      no_of_sessions: [val?.no_of_sessions ?? null, Validators.min(2)],
    });
  }

  createEndTimeLabel(val?: string | null) {
    if (!val) {
      return '';
    }
    const [endHour, minute] = val.match(/\d{2}/g)!;
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

  addRemoveTimeRange(dayOfWeek: string, selected: boolean) {
    const weekDay = this.weekDayOptions.find(weekDay => weekDay.value === dayOfWeek)!;
    weekDay.selected = selected;
    if (weekDay.selected) {
      this.addTimeRangeToWeekDay(dayOfWeek);
    } else {
      for (let i = this.timeRanges.controls.length; i >= 0; i--) {
        if (this.timeRanges.at(i)?.get('day_of_week')?.value === dayOfWeek) {
          this.deleteTimeRangeFromWeekday(dayOfWeek, i);
        }
      }
    }
  }

  addTimeRangeToWeekDay(dayOfWeek: string) {
    this.timeRanges.push(this.createTimeRanges({ day_of_week: dayOfWeek }));
    this.subscribeStartTimes();
  }

  deleteTimeRangeFromWeekday(dayOfWeek: string, index: number) {
    this.timeRanges.removeAt(index);
    if (!this.getTimeSlotsOfWeekday(dayOfWeek).length) {
      this.addRemoveTimeRange(dayOfWeek, false);
    }
    this.subscribeStartTimes();
  }

  getTimeSlotsOfWeekday(dayOfWeek: string) {
    return this.timeRanges.controls.filter(
      weekDay => weekDay?.get('day_of_week')?.value === dayOfWeek
    );
  }

  subscribeStartTimes() {
    this.startTimeUnsubscriber$.next();
    // subscribing start date, patching end date with duration
    this.timeRanges.controls.forEach(timeRange => {
      timeRange
        .get('start_time')
        ?.valueChanges.pipe(takeUntil(this.startTimeUnsubscriber$))
        .subscribe(() => this.updateEndTime(timeRange, this.productForm.get('duration')?.value));
    });
  }

  updateEndTime(timeRange: AbstractControl, duration: string) {
    const [hour, minute] = timeRange.get('start_time')?.value.match(/\d{2}/g);
    timeRange
      .get('end_time')
      ?.patchValue(
        `${((+hour + Math.floor((+minute + (+duration ?? 0)) / 60)) % 24)
          .toString()
          .padStart(2, '0')}${`${(+minute + (+duration ?? 0)) % 60}`.padStart(2, '0')}`
      );
    timeRange
      .get('end_time_label')
      ?.patchValue(this.createEndTimeLabel(timeRange.get('end_time')?.value));
  }

  addPricePackage() {
    this.pricePackages.push(this.createPricePackages());
  }

  async handleFileInput(event: Event, index: number) {
    try {
      const [file, url] = await this.utilsService.handleFileInput(event, 'image/');
      this.productPhotos.at(index).get('photo_file')?.patchValue(file);
      this.productPhotos.at(index).get('photo_data_url')?.patchValue(url);
    } catch (ex) {
      console.log(ex);
    }
    console.log(this.productPhotos);
  }

  deletePhoto(index: number) {
    this.productPhotos.at(index).patchValue({
      photo_url: '',
      photo_data_url: '',
      photo_file: null,
    });
  }

  deletePricePackage(index: number) {
    this.pricePackages.removeAt(index);
  }

  saveProductForm(form: FormGroup) {
    console.log(this.productForm.value);
  }

  get productPhotos() {
    return <FormArray>this.productForm.get('photos');
  }

  get pricePackages() {
    return <FormArray>this.productForm.get('price_package');
  }

  get timeRanges() {
    return <FormArray>this.productForm.get('time_ranges');
  }

  get photoForPreview() {
    for (const photo of this.productPhotos.controls) {
      if (photo.get('photo_data_url')?.value) {
        return photo.get('photo_data_url')?.value;
      }
    }
    return undefined;
  }

  get previewablePricePackages() {
    return this.pricePackages.controls.filter(
      pricePackage => pricePackage.get('price')?.value && pricePackage.get('no_of_sessions')?.value
    );
  }
}
