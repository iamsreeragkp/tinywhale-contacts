import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  resetPasswordForm!:FormGroup;
  isOtpVisible=true;

  constructor() {
    this.resetPasswordForm = this.createPasswordResetForm();
  }

  ngOnInit(): void {
  }

  createPasswordResetForm() {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  onResetPassword(){
    this.isOtpVisible=true;
  }

  get email() {
    return this.resetPasswordForm.get('email');
  }

}
