import { Location } from '@angular/common';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { debounceTime, filter, map, Observable, Subject, takeUntil } from 'rxjs';
import { BusinessLocation } from 'src/app/modules/accounts/store/account.interface';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { IAppState } from 'src/app/modules/core/reducers';
import { UtilsHelperService } from 'src/app/modules/core/services/utils-helper.service';
import {
  convert24HrsFormatToAmPm,
  Currency,
  currencyList,
  locationOptions,
  timeOptions,
  weekDayOptions,
} from 'src/app/shared/utils';
import {
  LocationType,
  PricePackage,
  Product,
  ProductLocationPayload,
  ProductPayload,
  ProductPhoto,
  ProductType,
  TimeRange,
  WeekDay,
} from '../../../service/shared/service.interface';
import {
  addService,
  getBusinessLocations,
  getService,
  initService,
} from '../../../service/store/service.actions';
import {
  getAddServiceStatus,
  getBusinessLocationsStatus,
  getServiceStatus,
} from '../../../service/store/service.selectors';

const enableDisableFormFields = [
  'capacity',
  'location',
  'time_ranges',
  'price_package',
  'duration',
];
@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss'],
})
export class AddServiceComponent implements OnInit, OnDestroy {
  productForm: FormGroup = new FormGroup({});
  locationOptions: ProductLocationPayload[] = locationOptions;
  // generating time options
  weekDayOptions = JSON.parse(JSON.stringify(weekDayOptions)) as {
    value: WeekDay;
    label: string;
    selected: boolean;
  }[];
  ngUnsubscribe = new Subject<void>();
  productFormUnsubscriber$ = new Subject<void>();
  editMode = false;
  createAnother = false;
  isGettingStarted = false;
  addServiceStatus$: Observable<
    { status: boolean; error?: string; response?: any; autoSave: boolean } | undefined
  >;
  productData$: Observable<{ product?: Product; status: boolean; error?: string } | undefined>;
  businessLocations$: Observable<
    { businessLocations?: BusinessLocation[]; status: boolean; error?: string } | undefined
  >;
  customerCurrency?: Currency;

  constructor(
    private store: Store<IAppState>,
    private _fb: FormBuilder,
    private utilsService: UtilsHelperService,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    public location: Location,
    authService: AuthService
  ) {
    const userData = authService.decodeUserToken();
    this.customerCurrency = currencyList.find(
      currency => currency.id === userData?.dashboardInfos?.default_currency
    );
    this.initForms();
    store.dispatch(getBusinessLocations());
    this.addServiceStatus$ = store.pipe(select(getAddServiceStatus));
    this.productData$ = this.store.pipe(select(getServiceStatus));
    this.businessLocations$ = this.store.pipe(select(getBusinessLocationsStatus));
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
    const productData = router.getCurrentNavigation()?.extras?.state?.['product'];
    if (productData) {
      this.initForms(productData, true);
    }
    this.isGettingStarted = router.url.split('/').includes('home');
  }

  ngOnInit(): void {
    this.subscriptions();
  }

  subscriptions() {
    this.businessLocations$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(val => !!val)
      )
      .subscribe(data => {
        if (data?.status && data?.businessLocations?.length) {
          const locationArray = data?.businessLocations.filter(
            (locationItem, index, self) =>
              index ===
              self.findIndex(locationData => {
                return locationData.location_name === locationItem.location_name;
              })
          );

          this.locationOptions = [
            ...locationOptions,
            ...locationArray.map(({ location_id, location_name, address }) => ({
              location_id,
              location_name,
              address,
              location_type: LocationType.BUSINESS_LOCATION,
            })),
          ];
        } else {
          console.log(data?.error);
        }
      });
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
          if (data.autoSave) {
            const productIdControl = this.productForm.get('product_id');
            if (productIdControl) {
              productIdControl.patchValue(data.response.product_id, { emitEvent: false });
            } else {
              this.productForm.addControl('product_id', this._fb.control(data.response.product_id));
            }
            if (data.response.time_ranges?.length) {
              data.response.time_ranges.forEach((timeRange: TimeRange, i: number) => {
                const controlWithId = this.timeRanges.controls.find(
                  tR => tR.get('class_time_range_id')?.value === timeRange.class_time_range_id
                );
                if (controlWithId) {
                  return;
                }
                const controlAtIndex = this.timeRanges?.at(i);
                if (controlAtIndex) {
                  controlAtIndex
                    ?.get('class_time_range_id')
                    ?.patchValue(timeRange.class_time_range_id, { emitEvent: false });
                  controlAtIndex.get('class_time_range_id')?.enable();
                }
              });
            }
            this.updateTimeSlotOptionsOfAWeekDay();
            if (data.response.price_package?.length) {
              data.response.price_package.forEach((classPkg: PricePackage, i: number) => {
                const controlWithId = this.pricePackages.controls.find(
                  pkg => pkg.get('class_package_id')?.value === classPkg.class_package_id
                );
                if (controlWithId) {
                  return;
                }
                const controlAtIndex = this.pricePackages?.at(i);
                if (controlAtIndex) {
                  controlAtIndex
                    ?.get('class_package_id')
                    ?.patchValue(classPkg.class_package_id, { emitEvent: false });
                  controlAtIndex.get('class_package_id')?.enable();
                }
              });
            }
            this.productFormSubscriptions();
          } else if (this.createAnother) {
            this.createAnother = false;
            if (this.editMode) {
              this.router.navigate(['/service/add-service'], {
                replaceUrl: true,
              });
            } else {
              this.initForms();
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
    this.productFormUnsubscriber$.next();
    this.productForm.valueChanges
      .pipe(debounceTime(3000), takeUntil(this.productFormUnsubscriber$))
      .subscribe(() => {
        this.saveProductForm(false, true);
      });
    this.productForm
      .get('duration')
      ?.valueChanges.pipe(takeUntil(this.productFormUnsubscriber$))
      .subscribe(duration => {
        this.getTimeSlotsOfWeekday().forEach(timeRange =>
          this.updateEndTimeAndOptions(timeRange, duration)
        );
      });
    this.subscribeStartTimes();
  }

  initForms(val?: Product, skipId = false) {
    this.productForm = this._fb.group({
      product_type: [val?.product_type ?? null, Validators.required],
      title: [val?.title ?? null, Validators.required],
      description: [val?.description ?? null, Validators.required],
      price: [val?.price ?? null],
      // currency: [val?.currency ?? null],
      visibility: [val?.visibility ?? null, Validators.required],
      photos: this._fb.array(
        Array.from({ length: 1 }, (_, i) => this.createPhotos(val?.product_photos?.[i]))
      ),
      location: [this.createLocation(val), Validators.required],
      price_package: this._fb.array(
        val?.class?.class_packages?.length
          ? val.class.class_packages.map(pkg => this.createPricePackages(pkg, skipId))
          : [this.createPricePackages()]
      ),
      time_ranges: this._fb.array(
        val?.class?.class_time_ranges?.length
          ? val.class.class_time_ranges.map(time_range => this.createTimeRanges(time_range, skipId))
          : []
      ),
      capacity: [val?.class?.capacity ?? null, [Validators.required, Validators.min(0)]],
      duration: [val?.class?.duration_in_minutes ?? null, [Validators.required, Validators.min(0)]],
    });
    this.updateTimeSlotOptionsOfAWeekDay();
    if (val?.product_id) {
      this.productForm.addControl('product_id', this._fb.control(val.product_id));
    }
    this.productFormSubscriptions();
  }

  createLocation(val?: Product): any {
    if (val?.class?.location_type) {
      if (val?.class?.location_type === 'BUSINESS_LOCATION') {
        return {
          location_id: val?.class?.business_location?.location_id,
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

  createTimeRanges(val?: TimeRange, skipId = false) {
    if (val?.day_of_week) {
      this.weekDayOptions.find(weekDay => weekDay.value === val.day_of_week)!.selected = true;
    }
    const timeRangeId =
      !skipId && val?.class_time_range_id ? val.class_time_range_id : Symbol('time_range');
    return this._fb.group({
      class_time_range_id: [
        {
          value: timeRangeId,
          disabled: skipId || !val?.class_time_range_id,
        },
      ],
      day_of_week: [val?.day_of_week ?? null],
      start_time: [val?.start_time ?? ''],
      end_time: [val?.end_time ?? ''],
      end_time_label: [{ value: convert24HrsFormatToAmPm(val?.end_time), disabled: true }],
      is_deleted: [false],
      slot_options: [
        { value: this.getTimeSlotOptions(val?.day_of_week, timeRangeId), disabled: true },
      ],
    });
  }

  createPricePackages(val?: PricePackage, skipId = false) {
    return this._fb.group({
      class_package_id: [
        {
          value: !skipId && val?.class_package_id ? val.class_package_id : Symbol('class_package'),
          disabled: skipId || !val?.class_package_id,
        },
      ],
      price: [val?.price ?? null],
      no_of_sessions: [val?.no_of_sessions ?? null, Validators.min(2)],
      is_deleted: [false],
    });
  }

  addRemoveTimeRange(dayOfWeek: WeekDay, selected: boolean) {
    const weekDay = this.weekDayOptions.find(weekDay => weekDay.value === dayOfWeek)!;
    weekDay.selected = selected;
    if (weekDay.selected) {
      this.addTimeRangeToWeekDay(dayOfWeek);
    } else {
      for (let i = this.timeRanges.controls.length; i >= 0; i--) {
        if (
          this.timeRanges.at(i)?.get('day_of_week')?.value === dayOfWeek &&
          !this.timeRanges.at(i)?.get('is_deleted')?.value
        ) {
          this.deleteTimeRangeFromWeekday(dayOfWeek, i);
        }
      }
    }
  }

  addTimeRangeToWeekDay(dayOfWeek: WeekDay) {
    this.timeRanges.push(this.createTimeRanges({ day_of_week: dayOfWeek }));
    this.updateTimeSlotOptionsOfAWeekDay(dayOfWeek);
    this.productFormSubscriptions();
  }

  deleteTimeRangeFromWeekday(dayOfWeek: WeekDay, index: number) {
    const timeRangeToDelete = this.timeRanges.at(index);
    if (timeRangeToDelete.get('class_time_range_id')?.disabled) {
      this.timeRanges.removeAt(index);
    } else {
      timeRangeToDelete.get('is_deleted')?.patchValue(true, { emitEvent: true });
    }
    if (!this.getTimeSlotsOfWeekday(dayOfWeek).length) {
      this.addRemoveTimeRange(dayOfWeek, false);
    }
    this.productFormSubscriptions();
  }

  getTimeSlotsOfWeekday(dayOfWeek?: string) {
    return this.timeRanges.controls.filter(
      weekDay =>
        !weekDay.get('is_deleted')?.value &&
        (!dayOfWeek || weekDay?.get('day_of_week')?.value === dayOfWeek)
    );
  }

  subscribeStartTimes() {
    // subscribing start date, patching end date with duration
    this.timeRanges.controls
      .filter(tR => !tR.get('is_deleted')?.value)
      .forEach(timeRange => {
        timeRange
          .get('start_time')
          ?.valueChanges.pipe(takeUntil(this.productFormUnsubscriber$))
          .subscribe(val => {
            console.log(val);
            this.updateEndTimeAndOptions(timeRange, this.productForm.get('duration')?.value);
          });
      });
  }

  updateEndTimeAndOptions(timeRange: AbstractControl, duration: string) {
    if (!timeRange.get('start_time')?.value) {
      timeRange.get('end_time')?.patchValue(null, { emitEvent: false });
      timeRange.get('end_time_label')?.patchValue(null, { emitEvent: false });
      return;
    }
    const [hour, minute] = timeRange.get('start_time')?.value.match(/\d{2}/g);
    timeRange
      .get('end_time')
      ?.patchValue(
        `${((+hour + Math.floor((+minute + (+duration ?? 0)) / 60)) % 24)
          .toString()
          .padStart(2, '0')}${`${(+minute + (+duration ?? 0)) % 60}`.padStart(2, '0')}`,
        { emitEvent: false }
      );
    timeRange
      .get('end_time_label')
      ?.patchValue(convert24HrsFormatToAmPm(timeRange.get('end_time')?.value), {
        emitEvent: false,
      });
    this.updateTimeSlotOptionsOfAWeekDay(timeRange.get('day_of_week')?.value);
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
    const pricePackage = this.pricePackages.at(index);
    if (pricePackage?.get('class_package_id')?.disabled) {
      this.pricePackages.removeAt(index);
    } else {
      pricePackage.get('is_deleted')?.patchValue(true, { emitEvent: true });
    }
  }

  expireSubscriptions() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.productFormUnsubscriber$.next();
    this.productFormUnsubscriber$.complete();
  }

  /*
    Get time slot options for each weekday
    First find all time slots utilized
    Considering the duration of session, remove adjacent timeslots if necessary
    return timeslots array
  */
  getTimeSlotOptions(dayOfWeek: WeekDay | null | undefined, id: symbol | number) {
    if (!dayOfWeek) {
      return timeOptions;
    }
    const controlsOfSameWeekDay = this.timeRanges.controls.filter(
      timeRange =>
        !timeRange.get('is_deleted')?.value &&
        timeRange.get('class_time_range_id')?.value !== id &&
        timeRange.get('day_of_week')?.value === dayOfWeek
    );
    const usedTimeSlots = controlsOfSameWeekDay.map(timeRange => ({
      slot: timeRange.get('start_time')?.value,
      nos: this.productForm.get('duration')?.value
        ? Math.ceil(this.productForm.get('duration')?.value / 30) - 1
        : 0,
    }));
    let timeSlots = [];
    for (let i = 0; i < timeOptions.length; i++) {
      const usedTimeSlot = usedTimeSlots.find(timeSlot => timeSlot.slot === timeOptions[i].value);
      if (usedTimeSlot) {
        i = i + usedTimeSlot.nos;
        continue;
      }
      timeSlots.push(timeOptions[i]);
    }
    return timeSlots;
  }

  saveProductForm(createAnother = false, autoSave = false) {
    console.log(this.productForm);
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
      photos: photosWithEmpty,
      price_package: pricePackagesWithEmpty,
      time_ranges: timeRangesWithEmpty,
      capacity,
      duration,
    } = this.productForm.value;
    let { location_id, location_name, location_type, address, dropdown_field_data } =
      location ?? {};
    if (dropdown_field_data?.custom_value) {
      location_type = LocationType.BUSINESS_LOCATION;
    }
    if (location_type !== LocationType.BUSINESS_LOCATION || dropdown_field_data?.custom_value) {
      location_id = undefined;
    }
    const photos: ProductPhoto[] =
      photosWithEmpty?.filter((photo: ProductPhoto) => photo.photo_url) ?? [];
    const price_package: PricePackage[] = (
      pricePackagesWithEmpty?.filter((pkg: PricePackage) => {
        return pkg.price || pkg.no_of_sessions || pkg.class_package_id;
      }) ?? []
    ).map(({ ...pkg }: PricePackage) => ({
      ...pkg,
      is_deleted: !pkg.price && !pkg.no_of_sessions,
    }));

    const time_ranges: TimeRange[] = (
      timeRangesWithEmpty?.filter((tR: TimeRange) => {
        return tR.end_time || tR.start_time || tR.class_time_range_id;
      }) ?? []
    ).map(({ ...tR }: TimeRange) => ({ ...tR, is_deleted: !tR.end_time && !tR.start_time }));
    const payload: ProductPayload = {
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
      photos,
      price_package,
      time_ranges,
      capacity,
      duration,
    };
    payload.is_active =
      this.productForm.valid &&
      !!photos.length &&
      (product_type === 'CLASS'
        ? !!time_ranges.length &&
          time_ranges.every(timeRange => timeRange.start_time && timeRange.end_time)
        : true);
    this.store.dispatch(addService({ productData: payload, autoSave }));
  }

  productTypeChange(product_type: ProductType) {
    enableDisableFormFields.forEach(field => {
      this.productForm
        .get(field)
        ?.[product_type === ProductType.CLASS ? 'enable' : 'disable']({ onlySelf: true });
    });
    this.timeRanges.controls.forEach(control => {
      if (typeof control.get('class_time_range_id')?.value === 'symbol') {
        control.get('class_time_range_id')?.disable();
      } else {
        control.get('class_time_range_id')?.enable();
      }
    });
    this.pricePackages.controls.forEach(control => {
      if (typeof control.get('class_package_id')?.value === 'symbol') {
        control.get('class_package_id')?.disable();
      } else {
        control.get('class_package_id')?.enable();
      }
    });
  }

  updateTimeSlotOptionsOfAWeekDay(day_of_week?: WeekDay) {
    console.log('updatingTimeSlots');
    this.getTimeSlotsOfWeekday(day_of_week).forEach(timeRange => {
      timeRange
        .get('slot_options')
        ?.patchValue(
          this.getTimeSlotOptions(
            timeRange.get('day_of_week')?.value,
            timeRange.get('class_time_range_id')?.value
          ),
          { emitEvent: false }
        );
    });
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

  scrollToTop() {
    window.scroll(0, 0);
  }

  ngOnDestroy(): void {
    this.expireSubscriptions();
    this.store.dispatch(initService());
  }
}
