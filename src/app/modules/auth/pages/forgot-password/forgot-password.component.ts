import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { setOtp } from '../../store/auth.actions';
import { IAuthState } from '../../store/auth.reducers';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  otpForm!: FormGroup;

  isOtpVisible = false;

  constructor(private store: Store<IAuthState>) {
    this.resetPasswordForm = this.createPasswordResetForm();
    this.otpForm = this.createOtpForm();
  }

  ngOnInit(): void {}

  createPasswordResetForm() {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  createOtpForm() {
    return new FormGroup({
      otp: new FormControl('', [Validators.required]),
    });
  }

  onResetPassword() {
    this.isOtpVisible = true;
    const { email } = this.resetPasswordForm?.value;
    const payload = {
      email,
    };
    console.log('payload', payload);
    this.store.dispatch(setOtp({ email: payload }));
  }

  get email() {
    return this.resetPasswordForm.get('email');
  }

  get otp() {
    return this.otpForm.get('otp');
  }
}
