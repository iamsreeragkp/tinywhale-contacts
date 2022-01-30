import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { PricePackage } from '../../shared/service.interface';

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
  constructor() {}
}
