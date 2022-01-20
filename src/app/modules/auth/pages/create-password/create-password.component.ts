import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { StorageService } from 'src/app/shared/services/storage.service';
import { passwordReset, signUp } from '../../store/auth.actions';
import { AccountType } from '../../store/auth.interface';
import { IAuthState } from '../../store/auth.reducers';
import { getKey, getVerifyData } from '../../store/auth.selectors';

@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.scss'],
})
export class CreatePasswordComponent implements OnInit,OnDestroy {
  passwordForm!: FormGroup;
  isReset=false;
  ngUnsubscribe = new Subject<any>();


  constructor(private router: ActivatedRoute, private store: Store<IAuthState>,private storageService:StorageService) {
    this.passwordForm = this.createPasswordForm();
  }

  ngOnInit(): void {
    this.router.queryParams.subscribe(data => {
      if(data?.['isVerified']){
        this.isReset=true;
      }else{
        this.isReset=false;
      }
    });
  }

  createPasswordForm() {
    return new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).*$/),
      ]),
    });
  }

  onSubmitSignUpFinal() {
    const { password } = this.passwordForm.value;
    const signupPayload = {
      email: localStorage.getItem('email'),
      custom_domain: localStorage.getItem('domain'),
      password: password,
      name: localStorage.getItem('email'),
      account_type: AccountType.BUSINESS,
    };
    this.store.dispatch(signUp({ userData: signupPayload }));
  }


  onSubmitReset(){
    const { password } = this.passwordForm.value;
    this.store.pipe(select(getVerifyData), takeUntil(this.ngUnsubscribe)).subscribe(data => {
      const access_token=data?.['access-token'];
      this.storageService.setAccessToken(access_token)
    });
    const resetPayload={
      password
    }
    this.store.dispatch(passwordReset({password:resetPayload}))
  }

  get password() {
    return this.passwordForm.get('password');
  }

  ngOnDestroy() {
    this.ngUnsubscribe.complete();
    this.ngUnsubscribe.next(false);
  }
}
