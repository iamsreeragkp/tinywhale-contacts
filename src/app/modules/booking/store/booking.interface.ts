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
export interface FilledSlotDetail {
  date: string;
  filled_class_time_range_ids: number[];
  is_date_selectable: boolean;
}

export type FilledSlotDetails = FilledSlotDetail[];
