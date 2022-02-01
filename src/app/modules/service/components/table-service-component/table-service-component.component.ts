import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { locationOptions, weekDayOptions } from 'src/app/shared/utils';
import { Product } from '../../shared/service.interface';
import { getServiceList } from '../../store/service.actions';
import { IServiceState } from '../../store/service.reducers';
import { getServiceListStatus } from '../../store/service.selectors';

@Component({
  selector: 'app-table-service-component',
  templateUrl: './table-service-component.component.html',
  styleUrls: ['./table-service-component.component.scss'],
})
export class TableServiceComponentComponent implements OnInit, OnDestroy {
  productsList: Product[] = [];
  scheduleOptions = [
    {
      id: 'CLASS',
      label: 'Fixed',
    },
    {
      id: 'SERVICE',
      label: 'Flexible',
    },
  ];
  weekDayOptions = weekDayOptions;
  pricingTypeOptions = [
    {
      id: 'PER_SESSION',
      label: 'Per Session',
    },
    {
      id: 'PER_PACKAGE',
      label: 'Per Package',
    },
  ];
  locationOptions = locationOptions;
  visibilityOptions = [
    {
      id: 'PUBLIC',
      label: 'Public',
    },
    {
      id: 'PRIVATE',
      label: 'Private',
    },
  ];
  threeDotsActions = ['Edit', 'Mark as Private', 'Use as Template', 'Delete'];

  productList$: Observable<{ products?: Product[]; error?: string; status: boolean } | undefined>;
  ngUnsubscribe = new Subject<void>();
  filterForm!: FormGroup;
  threeDotsOpen?: number;
  productToDelete?: number;
  openProductDeleteModal = false;

  constructor(
    private store: Store<IServiceState>,
    private _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productList$ = store.pipe(
      select(getServiceListStatus),
      takeUntil(this.ngUnsubscribe),
      filter(val => !!val)
    );
    this.filterForm = this.createFilterForm();
    store.dispatch(getServiceList({ filters: {} }));
  }

  ngOnInit(): void {
    this.subscriptions();
  }

  subscriptions() {
    this.productList$.subscribe(data => {
      if (data?.status && data?.products) {
        this.productsList = data.products;
      } else {
        console.log(data?.error);
      }
    });
    this.filterForm.valueChanges.subscribe(data => {
      const {days_of_week,location_type,pricing_type,product_type,status}=data;
      for(let i=0;i < days_of_week?.length;i++){
        console.log(days_of_week[i]);
      }
      this.store.dispatch(getServiceList({filters:{status:status? status : '',location_type:location_type ? location_type : '',product_type:product_type ? product_type : '',days_of_week:days_of_week ? days_of_week : '',pricing_type:pricing_type ? pricing_type : ''}}))
    }
      );
  }

  createFilterForm() {
    return this._fb.group({
      product_type: [null, Validators.maxLength(0)],
      status: [null, Validators.maxLength(0)],
      pricing_type: [null, Validators.maxLength(0)],
      location_type: [null, Validators.maxLength(0)],
      days_of_week: [null, Validators.maxLength(0)],
    });
  }

  resetFilterForm() {
    this.filterForm.reset();
  }

  handleAction(event: string, index: number) {
    if (event === 'Edit') {
      this.router.navigate(['../edit-service', this.productsList?.[index]?.product_id], {
        relativeTo: this.route,
      });
    } else if (event === 'Mark as Private') {
      // this.store.dispatch();
    } else if (event === 'Use as Template') {
    } else if (event === 'Delete') {
      this.productToDelete = index;
      this.openProductDeleteModal = true;
    }
  }

  closeDeleteModal(deleteProduct?: boolean) {
    if (deleteProduct) {
      // this.store.dispatch();
    }
    this.productToDelete = undefined;
    this.openProductDeleteModal = false;
  }

  get isFilterEmpty() {
    return this.filterForm.valid;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
