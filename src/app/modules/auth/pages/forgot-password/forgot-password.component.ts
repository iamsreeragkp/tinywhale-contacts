import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { setOtp, verifyOtp } from '../../store/auth.actions';
import { IAuthState } from '../../store/auth.reducers';
import { getError, getKey } from '../../store/auth.selectors';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  resetPasswordForm!: FormGroup;
  otpForm!: FormGroup;

  isOtpVisible = false;
  otpKey: any;
  fields = ['otp_0', 'otp_1', 'otp_2', 'otp_3', 'otp_4', 'otp_5'];
  @ViewChildren('formRow') rows: any;

  ngUnsubscribe = new Subject<any>();

  constructor(private store: Store<IAuthState>) {
    this.resetPasswordForm = this.createPasswordResetForm();
    // this.otpForm = this.createOtpForm();
  }

  ngOnInit(): void {
    this.otpForm = this.createForm(this.fields);
  }

  createPasswordResetForm() {
    return new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
    });
  }

  // createOtpForm() {
  //   return new FormGroup({
  //     otp1: new FormControl('', [Validators.required]),
  //     otp2: new FormControl('', [Validators.required]),
  //     otp3: new FormControl('', [Validators.required]),
  //     otp4: new FormControl('', [Validators.required]),
  //     otp5: new FormControl('', [Validators.required]),
  //     otp6: new FormControl('', [Validators.required]),
  //   });
  // }

  createForm(fields: string[]) {
    let group: any = {};
    fields.forEach(x => {
      group[x] = new FormControl();
    });
    return new FormGroup(group);
  }

  onResetPassword() {
    const { email } = this.resetPasswordForm?.value;
    const payload = {
      email,
    };
    // this.store.pipe(select(getKey), takeUntil(this.ngUnsubscribe)).subscribe(data => {
    //   console.log(data);
    //   if(data===null){
    //   // this.store.dispatch(setOtp({ email: payload }));
    //     this.isOtpVisible = false;
    //   }
    // });
    if (this.resetPasswordForm.valid) {
      this.isOtpVisible = true;
      this.store.dispatch(setOtp({ email: payload }));
    }
  }

  isVerifiedOtp = false;

  validateOtp() {
    console.log(this.otpForm?.value);
    const valuePayload = this.otpForm?.value;
    const finalOtp = Object.values(valuePayload).join('').toString();
    this.store.pipe(select(getKey), takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.otpKey = data?.data?.key;
    });
    const validateOtpPayload = {
      email: this.email?.value,
      key: this.otpKey,
      otp: finalOtp,
    };
    console.log(validateOtpPayload);
    this.store.dispatch(verifyOtp({ data: validateOtpPayload }));
    this.store.pipe(select(getError), takeUntil(this.ngUnsubscribe)).subscribe(data => {
      console.log(data);
      if (data) {
        this.isVerifiedOtp = true;
      }
    });
  }

  keyUpEvent(event: any, index: any) {
    if (event?.code.includes('Digit')) {
      let pos = index;
      if (event.keyCode === 8 && event.which === 8) {
        pos = index - 1;
      } else {
        pos = index + 1;
      }
      if (pos > -1 && pos < this.fields.length) {
        this.rows._results[pos].nativeElement.focus();
      }
    } else {
      index = 0;
    }
  }

  onPaste(event: ClipboardEvent) {
    let clipboardData = event.clipboardData || (<any>window).clipboardData;
    let pastedText = clipboardData.getData('text').split('').splice(0,6);
    setTimeout(()=>{
      this.fields.forEach((val,index)=>{
        this.otpForm.get(val)?.setValue(pastedText[index])
      })
    },0)
  }

  onInput(content: string) {
  //   console.log("New content: ", content);
  }

  backToReset() {
    this.isOtpVisible = false;
  }

  get email() {
    return this.resetPasswordForm.get('email');
  }

  get otp() {
    return this.otpForm.get('otp');
  }

  ngOnDestroy() {
    this.ngUnsubscribe.complete();
    this.ngUnsubscribe.next(false);
  }
}
