import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/modules/core/reducers';
import { OptionsType } from 'src/app/shared/interfaces/dropdown.interface';
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

  constructor(
    private store: Store<IAppState>,
    private _fb: FormBuilder,
    private productService: ServiceService
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    this.subscriptions();
  }

  subscriptions() {}

  initForms(val?: Product) {
    this.productForm = this._fb.group({
      product_type: [val?.product_type ?? '', Validators.required],
      title: [val?.title ?? ''],
      description: [val?.description ?? ''],
      price: [val?.price ?? null],
      currency: [val?.currency ?? ''],
      visibility: [val?.visibility ?? ''],
      photos: this._fb.array(
        val?.photos?.length
          ? val.photos.map(photo => this.createPhotos(photo))
          : Array(3).fill(this.createPhotos())
      ),
      location: [val?.class?.business_location ?? null],
      price_package: val?.class?.class_packages?.length
        ? val.class.class_packages.map(pkg => this.createPricePackages(pkg))
        : [this.createPricePackages()],
      time_ranges: val?.class?.class_time_ranges?.length
        ? val.class.class_time_ranges.map(time_range => this.createTimeRanges(time_range))
        : [this.createTimeRanges()],
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
    });
  }

  createTimeRanges(val?: TimeRange) {
    return this._fb.group({
      day_of_week: [val?.day_of_week ?? null, [Validators.pattern(/^[1-7]$/)]],
      start_time: [val?.start_time ?? ''],
      end_time: [val?.end_time ?? ''],
    });
  }

  createPricePackages(val?: PricePackage) {
    return this._fb.group({
      price: [val?.price ?? null],
      no_of_sessions: [val?.no_of_sessions ?? null],
    });
  }

  saveProductForm(form: FormGroup) {
    console.log(this.productForm);
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
}
