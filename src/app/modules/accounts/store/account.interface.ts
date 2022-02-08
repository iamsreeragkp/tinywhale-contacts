export interface AccountAddPayload {
  business_name?: any;
  type?: any;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: number;
  default_currency?: any;
  beneficiary_id?: any;
}

export interface AccountInfo {
  data: {
    business_id: number;
    business_name: any;
    first_name: string;
    last_name: string;
    type: string;
    business_type: string;
    logo: any;
    active_saas_plan: any;
    plan_start_date: Date;
    plan_end_date: Date;
    address_line_1: string;
    address_line_2: string;
    country: string;
    state: string;
    city: string;
    postal_code: number;
    default_currency: any;
    store_id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    payout_provider: string;
    kyc_status: string;
    payout_id: any;
    beneficiary_id: any;
  };
  message: string;
}

export interface BusinessLocation {
  location_id: number;
  business_id: number;
  location_name?: string | null;
  address?: string | null;
  created_at?: Date;
}
