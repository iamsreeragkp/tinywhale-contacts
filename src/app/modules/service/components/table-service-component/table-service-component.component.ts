import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { locationOptions, weekDayOptions } from 'src/app/shared/utils';
import { ServiceService } from '../../service.service';
import { Product } from '../../shared/service.interface';
import { changeVisibility, deleteServiceList, getServiceList } from '../../store/service.actions';
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
  deleteProductId: any;

  constructor(
    private store: Store<IServiceState>,
    private _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private serviceService:ServiceService
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
    this.filterForm.valueChanges.subscribe(data => console.log(data));
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

  handleAction(event: string, index: number, product_id: any) {
    if (event === 'Edit') {
      this.router.navigate(['../edit-service', this.productsList?.[index]?.product_id], {
        relativeTo: this.route,
      });
    } else if (event === 'Mark as Private') {
      const visibility = {
        visibility: 'PUBLIC',
      };
      this.store.dispatch(changeVisibility({ productId:product_id, visibility:visibility }));
      window.location.reload();
    } else if (event === 'Use as Template') {
    } else if (event === 'Delete') {
      this.productToDelete = index;
      this.openProductDeleteModal = true;
      this.deleteProductId = product_id;
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

  onDeleteProduct() {
    this.store.dispatch(deleteServiceList({ productId: this.deleteProductId }));
    this.productsList = this.productsList.filter(r => r.product_id !== this.deleteProductId);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
