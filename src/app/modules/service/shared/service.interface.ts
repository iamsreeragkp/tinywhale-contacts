import { BusinessLocation } from '../../accounts/store/account.interface';

export interface ProductPayload {
  product_id?: number | null;
  product_type?: ProductType | null;
  title?: string | null;
  description?: string | null;
  price?: number | null;
  currency?: string | null;
  visibility?: VisibilityType | null;
  location?: ProductLocationPayload | null;
  capacity?: number | null;
  photos?: ProductPhoto[] | null;
  price_package?: PricePackage[];
  duration?: number | null;
  time_ranges?: TimeRange[] | null;
}

export interface Product {
  product_id: number;
  business_id: number;
  product_type: ProductType | null;
  title?: string | null;
  description?: string | null;
  price?: number | null;
  currency?: string | null;
  product_photos?: ProductPhoto[] | null;
  visibility?: VisibilityType | null;
  class?: {
    class_id: number;
    duration_in_minutes?: number | null;
    capacity?: number | null;
    class_packages?: PricePackage[] | null;
    class_time_ranges?: TimeRange[] | null;
    business_location?: BusinessLocation | null;
    location_id?: number | null;
    location_type?: LocationType | null;
    location_description?: string | null;
  };
  service?: {
    service_id: number;
    deliverables?: string | null;
    duration?: string | null;
  };
}

export interface ProductPhoto {
  photo_id: number;
  photo_url: string;
}

export interface ProductLocationPayload {
  location_id?: number | null;
  location_type?: LocationType | null;
  location_name?: string | null;
  address?: string | null;
}

export interface PricePackage {
  class_package_id?: number | null;
  price?: number | null;
  no_of_sessions?: number | null;
}

export interface TimeRange {
  class_time_range_id?: number | null;
  day_of_week: WeekDay;
  start_time?: string | null;
  end_time?: string | null;
}

export enum ProductType {
  CLASS = 'CLASS',
  SERVICE = 'SERVICE',
}

export enum VisibilityType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export enum LocationType {
  CUSTOMER_LOCATION = 'CUSTOMER_LOCATION',
  BUSINESS_LOCATION = 'BUSINESS_LOCATION',
  ONLINE = 'ONLINE',
}

export enum WeekDay {
  Sunday = '1',
  Monday = '2',
  Tuesday = '3',
  Wednesday = '4',
  Thursday = '5',
  Friday = '6',
  Saturday = '7',
}

export interface ServiceListFilter {
  page?: number;
  limit?: number;
  status?: string;
  product_type?: string;
  location_type?: LocationType;
  days_of_week?: string;
  pricing_type?: string;
}
