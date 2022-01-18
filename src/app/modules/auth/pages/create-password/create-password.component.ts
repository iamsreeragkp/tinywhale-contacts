import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { signUp } from '../../store/auth.actions';
import { AccountType } from '../../store/auth.interface';
import { IAuthState } from '../../store/auth.reducers';

@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.scss'],
})
export class CreatePasswordComponent implements OnInit {
  passwordForm!: FormGroup;
  formFieldDatas: any;

  constructor(private router: ActivatedRoute, private store: Store<IAuthState>) {
    this.passwordForm = this.createPasswordForm();
  }

  ngOnInit(): void {
    this.router.queryParams.subscribe(data => {
      this.formFieldDatas = data;
    });
  }

  createPasswordForm() {
    return new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('[0-9A-Za-z]+'),
      ]),
    });
  }

  onSubmitSignUpFinal() {
    const { password } = this.passwordForm.value;
    const signupPayload = {
      email: this.formFieldDatas.email,
      custom_domain: this.formFieldDatas.domain,
      password: password,
      name: this.formFieldDatas.email,
      account_type: AccountType.BUSINESS,
    };
    this.store.dispatch(signUp({ user: signupPayload }));
  }

  get password() {
    return this.passwordForm.get('password');
  }
}
