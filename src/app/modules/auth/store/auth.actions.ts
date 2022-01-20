import { createAction, props } from '@ngrx/store';
import { Auth, Otp } from './auth.interface';

export const signUp = createAction('[AuthModule] SIGN UP', props<{ userData: any }>());

export const signUpSuccess = createAction('[AuthModule] SIGN UP SUCCESS', props<{ response: any }>());

export const signUpError = createAction('[AuthModule] SIGN UP ERROR',props<{error?: string}>());

export const logIn = createAction('[AuthModule] LOGIN', props<{ user: Auth }>());

export const logInSuccess = createAction('[AuthModule] LOGIN SUCCESS', props<{ user: Auth[] }>());

export const logInError = createAction('[AuthModule] LOGIN ERROR',props<{error?: string}>());

export const searchDomain = createAction('[Domain] searchDomain', props<{ searchDomain: string }>());
export const searchDomainSuccess = createAction('[Domain] searchDomainSuccess', props<{ domainItem: string }>());
export const searchDomainFail = createAction('[Domain] searchDomainFail', props<{ error?: any }>());

export const setOtp = createAction('[OTP] setOtp', props<{ email: Otp }>());
export const setOtpSuccess = createAction('[OTP] setOtpSuccess', props<{ response:any }>());
export const setOtpFail = createAction('[OTP] setOtpFail', props<{ error?: any }>());

export const verifyOtp = createAction('[OTP] verifyOtp', props<{ data:any }>());
export const verifyOtpSuccess = createAction('[OTP] verifyOtpSuccess', props<{ response:any }>());
export const verifyOtpFail = createAction('[OTP] verifyOtpFail', props<{ error?: any }>());

export const passwordReset = createAction('[OTP] passwordReset', props<{ password: any }>());
export const passwordResetSuccess = createAction('[OTP] passwordResetSuccess', props<{ response:any }>());
export const passwordResetFail = createAction('[OTP] passwordResetFail', props<{ error?: any }>());
