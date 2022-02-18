import { TitleCasePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { AppConfigType, APP_CONFIG } from 'src/app/configs/app.config';
import {
  Currency,
  currencyList,
  locationFilterOptions,
  weekDayFilterOptions,
} from 'src/app/shared/utils';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/auth/auth.service';
import {
  LocationType,
  Product,
  ProductType,
  ServiceListFilter,
  SortOrder,
  VisibilityType,
} from '../../shared/service.interface';
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
  productsCount?: number;
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
  weekDayOptions = weekDayFilterOptions;
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
  locationOptions = locationFilterOptions;
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

  productList$: Observable<
    { products?: Product[]; productsCount?: number; error?: string; status: boolean } | undefined
  >;
  ngUnsubscribe = new Subject<void>();
  filterForm!: FormGroup;
  threeDotsOpen?: number;
  productToDelete?: number;
  openProductDeleteModal = false;
  page: number;
  limit: number;
  copyView: any = null;
  copyStatus: string = 'Copy';
  baseURL = environment.tinyWhaleBaseUrl;
  copyURL: string = '';
  customUsername!: string;
  dashboardInfos: any;
  public current: string = SortOrder.asc;
  isdata: boolean = true;
  isNodata: boolean = false;
  orderType: any;
  customerCurrency?: Currency;
  currentCount?: number;
  isLoadMore = false;

  constructor(
    private store: Store<IServiceState>,
    private _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private titleCasePipe: TitleCasePipe,
    private authService: AuthService,
    @Inject(APP_CONFIG) private appConfig: AppConfigType
  ) {
    this.productList$ = store.pipe(
      select(getServiceListStatus),
      takeUntil(this.ngUnsubscribe),
      filter(val => !!val)
    );
    this.filterForm = this.createFilterForm();
    this.page = appConfig.defaultStartPage;
    this.limit = appConfig.defaultPageLimit;
    store.dispatch(
      getServiceList({
        filters: {
          page: this.page,
          limit: this.limit,
          order_type: this.orderType ? this.orderType : '',
        },
      })
    );
  }

  ngOnInit(): void {
    this.subscriptions();
    const userData = this.authService.decodeUserToken();
    this.customerCurrency = currencyList.find(
      currency => currency.id === userData?.dashboardInfos?.currency
    );
    this.customUsername = userData.dashboardInfos.customUsername;
    this.dashboardInfos = userData.dashboardInfos;
  }
  copyViewBox(index: number, productId: number) {
    index === this.copyView ? (this.copyView = null) : (this.copyView = index);
    this.copyStatus = 'Copy';
    this.copyURL = `${this.baseURL}/${this.customUsername}/service/${productId}/booknow`;
  }

  copyInputMessage(inputElement: any) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.copyStatus = 'Copied';
  }

  validateCount(count: any) {
    if (count >= 5) {
      this.isLoadMore = true;
    }
  }
  subscriptions() {
    this.productList$.subscribe(data => {
      if (data?.status && data?.products) {
        this.productsList = data.products;
        this.productsCount = data.productsCount;
        this.validateCount(this.productsCount);
      } else {
        console.log(data?.error);
      }
    });
    this.filterForm.valueChanges.subscribe(data => {
      this.resetPage();
      this.fetchServiceList();
    });
  }

  resetPage() {
    this.page = this.appConfig.defaultStartPage;
    this.limit = this.appConfig.defaultPageLimit;
  }

  loadMore() {
    this.limit += this.appConfig.defaultPageLimit;
    this.fetchServiceList();
  }

  fetchServiceList() {
    this.store.dispatch(
      getServiceList({
        filters: {
          ...this.constructFilterPayload(),
          page: this.page,
          limit: this.limit,
          order_by: 'NAME',
          order_type: this.orderType ? this.orderType : '',
        },
      })
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

  visibilities: any;

  handleAction(event: string, product: Product) {
    if (event === 'Edit') {
      this.router.navigate(['../edit-service', product.product_id], {
        relativeTo: this.route,
      });
    } else if (['Mark as Private', 'Mark as Public'].includes(event)) {
      this.visibilities = event.includes('Private')
        ? VisibilityType.PRIVATE
        : VisibilityType.PUBLIC;

      this.store.dispatch(
        changeVisibility({
          productId: product.product_id,
          visibility: { visibility: this.visibilities },
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
  filterClear(event: any) {
    if (event === true) {
      this.filterForm.reset();
    }
  }

  sortDatad() {
    if (this.current === SortOrder.asc) {
      this.current = SortOrder.desc;
      this.isdata = true;
      const order_by = 'NAME';
      this.orderType = this.current;
      this.store.dispatch(
        getServiceList({
          filters: {
            order_by: order_by,
            order_type: this.orderType,
            page: this.page,
            limit: this.limit,
          },
        })
      );
    } else if (this.current === SortOrder.desc) {
      this.isdata = false;
      this.current = SortOrder.asc;
      const order_by = 'NAME';
      this.orderType = this.current;
      this.store.dispatch(
        getServiceList({
          filters: {
            order_by: order_by,
            order_type: this.orderType,
            page: this.page,
            limit: this.limit,
          },
        })
      );
    }
  }

  get isFilterEmpty() {
    return this.filterForm.valid;
  }

  get LocationType() {
    return LocationType;
  }

  get ProductType() {
    return ProductType;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
