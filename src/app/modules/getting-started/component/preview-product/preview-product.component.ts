import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { Currency, currencyList } from 'src/app/shared/utils';
import { PricePackage, ProductType } from '../../../service/shared/service.interface';

@Component({
  selector: 'app-preview-product',
  templateUrl: './preview-product.component.html',
  styleUrls: ['./preview-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewProductComponent {
  @Input() title?: string | null = '';
  @Input() description?: string | null = '';
  @Input() photo?: string | null = '';
  @Input() duration?: number | null = null;
  @Input() price?: number | null = null;
  @Input() packages?: PricePackage[] = [];
  @Input() product_type?: ProductType | null = ProductType.CLASS;
  customerCurrency?: Currency;
  constructor(authService: AuthService) {
    const userData = authService.decodeUserToken();
    this.customerCurrency = currencyList.find(
      currency => currency.id === userData?.dashboardInfos?.currency
    );
  }

  get ProductType() {
    return ProductType;
  }
}
