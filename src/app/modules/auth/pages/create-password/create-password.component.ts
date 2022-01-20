import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { passwordReset, signUp } from '../../store/auth.actions';
import { AccountType } from '../../store/auth.interface';
import { IAuthState } from '../../store/auth.reducers';

@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.scss'],
})
export class CreatePasswordComponent implements OnInit {
  passwordForm!: FormGroup;
  isReset=false;

  constructor(private router: ActivatedRoute, private store: Store<IAuthState>) {
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
    const resetPayload={
      password
    }
    this.store.dispatch(passwordReset({password:resetPayload}))
  }

  get password() {
    return this.passwordForm.get('password');
  }
}
