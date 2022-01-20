export interface Auth {
  email: string;
  password?: string;
  name?: string;
  account_type?: AccountType;
  custom_domain?: string;
}

export enum AccountType {
  CUSTOMER = 'CUSTOMER',
  BUSINESS = 'BUSINESS',
}

export enum Type{
  GOOGLE="GOOGLE"
}

export interface Otp {
  email:string;
  key?:any;
  otp?:number;
  password?:any;
}
