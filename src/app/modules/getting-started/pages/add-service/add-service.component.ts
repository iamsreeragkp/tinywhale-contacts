import { Location } from '@angular/common';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { debounceTime, filter, map, Observable, Subject, takeUntil } from 'rxjs';
import { IAppState } from 'src/app/modules/core/reducers';
import { UtilsHelperService } from 'src/app/modules/core/services/utils-helper.service';
import { OptionsType } from 'src/app/shared/interfaces/dropdown.interface';
import {
  convert24HrsFormatToAmPm,
  locationOptions,
  timeOptions,
  weekDayOptions,
} from 'src/app/shared/utils';
import {
  LocationType,
  PricePackage,
  Product,
  ProductPhoto,
  TimeRange,
  WeekDay,
} from '../../../service/shared/service.interface';
import { addService, getService, initService } from '../../../service/store/service.actions';
import { getAddServiceStatus, getServiceStatus } from '../../../service/store/service.selectors';

@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss'],
})
export class AddServiceComponent implements OnInit, OnDestroy {
  productForm: FormGroup = new FormGroup({});
  locationOptions = locationOptions;
  // generating time options
  timeOptions = timeOptions;
  weekDayOptions = weekDayOptions;
  ngUnsubscribe = new Subject<void>();
  startTimeUnsubscriber$ = new Subject<void>();
  editMode = false;
  createAnother = false;
  autoSaving = false;
  isGettingStarted = false;
  addServiceStatus$: Observable<{ status: boolean; error?: string; response?: any } | undefined>;
  productData$: Observable<{ product?: Product; status: boolean; error?: string } | undefined>;
  constructor(
    private store: Store<IAppState>,
    private _fb: FormBuilder,
    private utilsService: UtilsHelperService,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    public location: Location
  ) {
    this.initForms();
    this.addServiceStatus$ = store.pipe(select(getAddServiceStatus));
    this.productData$ = this.store.pipe(select(getServiceStatus));
    route.params
      .pipe(
        takeUntil(this.ngUnsubscribe),
        map(params => params['id']),
        filter(val => !!val)
      )
      .subscribe(id => {
        console.log(id);
        this.editMode = true;
        this.zone.run(() => {
          setTimeout(() => {
            this.store.dispatch(getService({ product_id: id }));
          }, 100);
        });
      });
    this.isGettingStarted = router.url.split('/').includes('home');
  }

  ngOnInit(): void {
    this.subscriptions();
  }

  subscriptions() {
    this.productFormSubscriptions();
    this.productData$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(val => !!val)
      )
      .subscribe(data => {
        if (data?.status) {
          this.initForms(data.product);
          this.productFormSubscriptions();
        } else {
          console.log(data?.error);
        }
      });
    this.addServiceStatus$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(status => !!status)
      )
      .subscribe(data => {
        if (data?.status) {
          if (this.autoSaving) {
            this.autoSaving = false;
            if (!this.editMode) {
              this.router.navigate(['/service/edit-service', data?.response?.product_id], {
                replaceUrl: true,
              });
            }
          } else if (this.createAnother) {
            if (this.editMode) {
              this.router.navigate(['/service/add-service'], {
                replaceUrl: true,
              });
            } else {
              this.initForms();
              this.expireSubscriptions();
              this.subscriptions();
            }
          } else {
            this.location.back();
          }
        } else {
          console.log(data?.error);
        }
      });
  }

  productFormSubscriptions() {
    this.productForm.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe), debounceTime(5000))
      .subscribe(() => {
        this.autoSaving = true;
        this.saveProductForm();
      });
    this.productForm
      .get('duration')
      ?.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(duration => {
        this.timeRanges.controls.forEach(timeRange => this.updateEndTime(timeRange, duration));
      });
    this.subscribeStartTimes();
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
        Array.from({ length: 3 }, (_, i) => this.createPhotos(val?.product_photos?.[i]))
      ),
      location: [this.createLocation(val)],
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
      this.productForm.addControl('product_id', this._fb.control(val.product_id));
    }
  }

  createLocation(val?: Product): any {
    if (val?.class?.location_type) {
      if (val?.class?.location_type === 'BUSINESS_LOCATION') {
        return {
          location_id: val?.class?.location_id,
          location_type: val?.class?.location_type,
          location_name: val?.class?.business_location?.location_name,
          address: val?.class?.business_location?.address,
        };
      } else {
        return this.locationOptions.find(
          location => location['location_type'] === val?.class?.location_type
        );
      }
    }
    return null;
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
      end_time_label: [{ value: convert24HrsFormatToAmPm(val?.end_time), disabled: true }],
    });
  }

  createPricePackages(val?: PricePackage) {
    return this._fb.group({
      price: [val?.price ?? null],
      no_of_sessions: [val?.no_of_sessions ?? null, Validators.min(2)],
    });
  }

  addRemoveTimeRange(dayOfWeek: WeekDay, selected: boolean) {
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

  addTimeRangeToWeekDay(dayOfWeek: WeekDay) {
    this.timeRanges.push(this.createTimeRanges({ day_of_week: dayOfWeek }));
    this.subscribeStartTimes();
  }

  deleteTimeRangeFromWeekday(dayOfWeek: WeekDay, index: number) {
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
      ?.patchValue(convert24HrsFormatToAmPm(timeRange.get('end_time')?.value));
  }

  addPricePackage() {
    this.pricePackages.push(this.createPricePackages());
  }

  async handleFileInput(event: Event, index: number) {
    try {
      const [file, url, fileKey] = await this.utilsService.handleFileInput(
        event,
        'product_photos',
        'image/',
        true
      );
      this.productPhotos.at(index).get('photo_file')?.patchValue(file);
      this.productPhotos.at(index).get('photo_data_url')?.patchValue(url);
      this.productPhotos.at(index).get('photo_url')?.patchValue(fileKey);
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

  expireSubscriptions() {
    this.ngUnsubscribe.next();
  }

  saveProductForm(createAnother = false) {
    this.createAnother = createAnother;
    const {
      product_type,
      product_id,
      title,
      description,
      price,
      currency,
      visibility,
      location,
      photos,
      price_package,
      time_ranges,
      capacity,
      duration,
    } = this.productForm.value;
    let { location_id, location_name, location_type, address } = location ?? {};
    if (location_type !== LocationType.BUSINESS_LOCATION) {
      location_id = undefined;
    }
    const payload = {
      product_id,
      product_type,
      title,
      description,
      price,
      currency,
      visibility,
      location: {
        location_id,
        location_name,
        location_type,
        address,
      },
      photos: photos.filter((photo: ProductPhoto) => photo.photo_url),
      price_package: price_package.filter((pkg: PricePackage) => pkg.price && pkg.no_of_sessions),
      time_ranges: time_ranges.filter((tR: TimeRange) => tR.end_time && tR.start_time),
      capacity,
      duration,
    };
    this.store.dispatch(addService({ productData: payload }));
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
    return this.pricePackages.value.filter(
      (pricePackage: PricePackage) => pricePackage?.price && pricePackage?.no_of_sessions
    );
  }

  ngOnDestroy(): void {
    this.expireSubscriptions();
    this.ngUnsubscribe.complete();
    this.store.dispatch(initService());
  }
}
