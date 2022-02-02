import { TitleCasePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { locationOptions, weekDayOptions } from 'src/app/shared/utils';
import { ServiceService } from '../../service.service';
import { Product, ServiceListFilter, VisibilityType } from '../../shared/service.interface';
import { changeVisibility, deleteServiceList, getServiceList } from '../../store/service.actions';
import { IServiceState } from '../../store/service.reducers';
import { getServiceListStatus } from '../../store/service.selectors';

@Component({
  selector: 'app-table-service-component',
  templateUrl: './table-service-component.component.html',
  styleUrls: ['./table-service-component.component.scss'],
  providers: [TitleCasePipe],
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
    private route: ActivatedRoute,
    private titleCasePipe: TitleCasePipe
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
      this.store.dispatch(
        getServiceList({
          filters: this.constructFilterPayload(),
        })
      );
    });
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

  handleAction(event: string, product: Product) {
    if (event === 'Edit') {
      this.router.navigate(['../edit-service', product.product_id], {
        relativeTo: this.route,
      });
    } else if (['Mark as Private', 'Mark as Public'].includes(event)) {
      const visibility = event.includes('Public') ? VisibilityType.PRIVATE : VisibilityType.PUBLIC;
      this.store.dispatch(
        changeVisibility({
          productId: product.product_id,
          visibility: visibility,
          filters: this.constructFilterPayload(),
        })
      );
    } else if (event === 'Use as Template') {
      const { product_id, title: oldTitle, ...needed } = product;
      const title = `Copy of ${oldTitle ?? ''}`;
      const cloneProduct = { ...needed, title };
      this.router.navigate(['..', 'add-service'], {
        relativeTo: this.route,
        state: { product: cloneProduct },
      });
    } else if (event === 'Delete') {
      this.productToDelete = product.product_id;
      this.openProductDeleteModal = true;
    }
  }

  constructFilterPayload() {
    const { days_of_week, location_type, pricing_type, product_type, status } =
      this.filterForm.value;
    const filterObj: ServiceListFilter = {};
    if (product_type) {
      filterObj.product_type = product_type;
    }
    if (location_type) {
      filterObj.location_type = location_type;
    }
    if (status) {
      filterObj.status = status;
    }
    if (pricing_type) {
      filterObj.pricing_type = pricing_type;
    }
    if (days_of_week) {
      filterObj.days_of_week = days_of_week?.join(',');
    }
    return filterObj;
  }

  closeDeleteModal(deleteProduct?: boolean) {
    if (deleteProduct && this.productToDelete) {
      this.store.dispatch(
        deleteServiceList({
          productId: this.productToDelete,
          filters: this.constructFilterPayload(),
        })
      );
    }
    this.productToDelete = undefined;
    this.openProductDeleteModal = false;
  }

  getActions(product: Product) {
    const actionsArr = ['Edit'];
    if (product.visibility) {
      actionsArr.push(
        `Mark as ${this.titleCasePipe.transform(
          product.visibility === VisibilityType.PUBLIC
            ? VisibilityType.PRIVATE
            : VisibilityType.PUBLIC
        )}`
      );
    }
    actionsArr.push('Use as Template', 'Delete');
    return actionsArr;
  }

  get isFilterEmpty() {
    return this.filterForm.valid;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
