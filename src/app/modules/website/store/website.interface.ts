export interface BusinessInfo {
  business_id: number;
  business_name?: string;
  logo?: string;
  cover?: string;
  email: string;
  phone_number: string;
  contact_type: any;
  store: BusinessStore;
  links?: BusinessLinks[];
  recognitions?: Recognitions[];
  testimonials?: Testimonials[];
  business_photos?: BusinessPhotos[];
}

export interface BusinessStore {
  store_id: number;
  company_name?: string;
  punchline?: string;
  about_me?: string;
}

export interface BusinessLinks {
  title: string;
  url: string;
  link_id: number;
}

export interface Recognitions {
  recognition_id: number;
  recognition_type: string;
  recognition_name: string;
  expiry_date?: Date | null;
  photo_url: string;
}

export interface Testimonials {
  testimonial_id: number;
  name: string;
  title: string;
  testimonial: string;
  photo_url: string;
  rating: number;
}

export interface BusinessPhotos {
  photo_url: string;
  business_id?: string;
  photo_id: number;
}

export interface BusinessEditPayload {
  business_id?: number;
  logo?: string;
  company_name?: string;
  punchline?: string;
  about_me?: string;
  social_links?: BusinessLinks;
  photos?: BusinessPhotos;
  recognitions?: Recognitions;
  testimonials?: Testimonials;
}
