import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { IAppState } from 'src/app/modules/core/reducers';
import {
  changeVisibility,
  deleteServiceList,
  getService,
  initService,
} from '../../store/service.actions';
import { Product, ProductType, VisibilityType, WeekDay } from '../../shared/service.interface';
import { getServiceStatus } from '../../store/service.selectors';
import { ActivatedRoute, Router } from '@angular/router';
import { TimeRangeSerialized } from 'src/app/shared/interfaces/time-range.interface';
import {
  Currency,
  currencyList,
  getTimeRangeSerializedBasedOnWeekdayWithoutCoinciding,
} from 'src/app/shared/utils';
import { TitleCasePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/auth/auth.service';

@Component({
  selector: 'app-view-service',
  templateUrl: './view-service.component.html',
  styleUrls: ['./view-service.component.scss'],
  providers: [TitleCasePipe],
})
export class ViewServiceComponent implements OnInit, OnDestroy {
  ngUnsubscriber = new Subject<void>();
  productObj?: Product;
  timeRangeSerialized?: TimeRangeSerialized[];
  product$: Observable<{ product?: Product; status: boolean; error?: string } | undefined>;
  threeDotsActions: string[] = [];
  openProductDeleteModal = false;
  copyView: any = null;
  copyStatus: string = 'Copy';
  baseURL = environment.tinyWhaleBaseUrl;
  copyURL: string = '';
  customUsername!: string;
  customerCurrency?: Currency;
  domainActive = false;

  constructor(
    private store: Store<IAppState>,
    private route: ActivatedRoute,
    private titleCasePipe: TitleCasePipe,
    private router: Router,
    private authService: AuthService
  ) {
    this.product$ = store.pipe(select(getServiceStatus));
    // store.dispatch(getDashboard());
    this.getProduct();
  }

  ngOnInit(): void {
    this.subscriptions();
    const userData = this.authService.decodeUserToken();
    this.domainActive = userData?.dashboardInfos?.domainActive;
    this.customerCurrency = currencyList.find(
      currency => currency.id === userData?.dashboardInfos?.default_currency
    );
    this.customUsername = userData.dashboardInfos.customUsername;
  }

  getProduct() {
    const product_id = +this.route.snapshot.params['id'];
    if (product_id) {
      this.store.dispatch(getService({ product_id }));
    }
  }

  subscriptions() {
    this.product$
      .pipe(
        takeUntil(this.ngUnsubscriber),
        filter(val => !!val)
      )
      .subscribe(data => {
        if (data?.status && data?.product) {
          this.productObj = data.product;
          let actionsArr = ['Edit'];
          if (data.product?.visibility) {
            actionsArr.push(
              `Mark as ${this.titleCasePipe.transform(
                data.product.visibility === VisibilityType.PUBLIC
                  ? VisibilityType.PRIVATE
                  : VisibilityType.PUBLIC
              )}`
            );
          }
          actionsArr.push('Use as Template', 'Delete');
          this.threeDotsActions = actionsArr;
          if (this.productObj?.class?.class_time_ranges?.length) {
            this.timeRangeSerialized = getTimeRangeSerializedBasedOnWeekdayWithoutCoinciding(
              this.productObj.class.class_time_ranges
            );
          }
        } else {
          console.log(data?.error);
        }
      });
  }
  visibilities: any;

  handleAction(event: string) {
    if (!this.productObj) {
      return;
    }
    if (event === 'Edit') {
      this.router.navigate(['../../edit-service', this.productObj?.product_id], {
        relativeTo: this.route,
      });
    } else if (['Mark as Private', 'Mark as Public'].includes(event)) {
      this.visibilities = event.includes('Private')
        ? VisibilityType.PRIVATE
        : VisibilityType.PUBLIC;

      this.store.dispatch(
        changeVisibility({
          productId: this.productObj?.product_id,
          visibility: { visibility: this.visibilities },
        })
      );
    } else if (event === 'Use as Template') {
      const { product_id, title: oldTitle, ...needed } = this.productObj;
      const title = `Copy of ${oldTitle ?? ''}`;
      const cloneProduct = { ...needed, title };
      this.router.navigate(['../../add-service'], {
        relativeTo: this.route,
        state: { product: cloneProduct },
      });
    } else if (event === 'Delete') {
      this.openProductDeleteModal = true;
    }
  }

  closeDeleteModal(deleteProduct?: boolean) {
    if (deleteProduct && this.productObj) {
      this.store.dispatch(
        deleteServiceList({
          productId: this.productObj?.product_id,
        })
      );
      this.router.navigateByUrl('/service/home');
    }
    this.openProductDeleteModal = false;
  }

  get photoForPreview() {
    return this.productObj?.product_photos?.find(photo => photo.photo_url)?.photo_url;
  }

  get previewablePackages() {
    return (
      this.productObj?.class?.class_packages?.filter(pkg => pkg?.price && pkg?.no_of_sessions) ?? []
    );
  }

  get ProductType() {
    return ProductType;
  }

  copyViewBox() {
    this.copyView = !this.copyView;
    this.copyStatus = 'Copy';
    this.copyURL = `${this.baseURL}/${this.customUsername}/service/${this.productObj?.product_id}/booknow`;
  }

  copyInputMessage(inputElement: any) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.copyStatus = 'Copied';
  }

  ngOnDestroy() {
    this.store.dispatch(initService());
    this.ngUnsubscriber.next();
    this.ngUnsubscriber.complete();
  }
}
