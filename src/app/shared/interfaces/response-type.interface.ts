export interface ResponseType {
  status: boolean;
  message?: string;
  data?: any;
  errors?: any[];
}

export interface SignedUrlResponse {
  signedURL: { [k: string]: string };
}
