export interface Booking {
  email?: string;
  phonenumber?: string;
  customername?: string;
  service?: string;
  date?: string;
  slot?: string;
  payment?: string;
}

export enum BookingType {
  BUSINESS_OWNER = 'BUSINESS_OWNER',
}
