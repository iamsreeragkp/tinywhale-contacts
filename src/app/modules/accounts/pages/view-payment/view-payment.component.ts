import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { getPayment } from '../../store/account.actions';
import { IAccountState } from '../../store/account.reducers';
import { getPayments } from '../../store/account.selectors';

@Component({
  selector: 'app-view-payment',
  templateUrl: './view-payment.component.html',
  styleUrls: ['./view-payment.component.scss'],
})
export class ViewPaymentComponent {
  paymentInfo: any;
  constructor(
    private store: Store<IAccountState>,
    private authService: AuthService,
    private router: Router
  ) {
    store.dispatch(getPayment());
    store.pipe(select(getPayments)).subscribe(data => {
      this.paymentInfo = data;
    });
  }

  onLogout() {
    this.authService.onlogout();
  }

  navigateToEdit() {
    this.router.navigateByUrl('/account/edit-payment');
  }
}
