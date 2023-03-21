export interface PaypalOrderStatusResponse {
  id: string;
  intent: string;
  status: string;
  payment_source: PaymentSource;
  purchase_units: PurchaseUnits[];
  payer: Payer;
  create_time: string;
  update_time: string;
  links: Links[];
}

export interface Name {
  given_name: string;
  surname: string;
}

export interface Address {
  country_code: string;
}

export interface Paypal {
  email_address: string;
  account_id: string;
  name: Name;
  address: Address;
}

export interface PaymentSource {
  paypal: Paypal;
}

export interface Amount {
  currency_code: string;
  value: string;
}

export interface Payee {
  email_address: string;
  merchant_id: string;
}

export interface Name {
  full_name: string;
}

export interface Address {
  address_line_1: string;
  admin_area_2: string;
  admin_area_1: string;
  postal_code: string;
  country_code: string;
}

export interface Shipping {
  name: Name;
  address: Address;
}

export interface SellerProtection {
  status: string;
  dispute_categories: string[];
}

export interface GrossAmount {
  currency_code: string;
  value: string;
}

export interface PaypalFee {
  currency_code: string;
  value: string;
}

export interface NetAmount {
  currency_code: string;
  value: string;
}

export interface SellerReceivableBreakdown {
  gross_amount: GrossAmount;
  paypal_fee: PaypalFee;
  net_amount: NetAmount;
}

export interface Links {
  href: string;
  rel: string;
  method: string;
}

export interface Captures {
  id: string;
  status: string;
  amount: Amount;
  final_capture: boolean;
  seller_protection: SellerProtection;
  seller_receivable_breakdown: SellerReceivableBreakdown;
  links: Links[];
  create_time: string;
  update_time: string;
}

export interface Payments {
  captures: Captures[];
}

export interface PurchaseUnits {
  reference_id: string;
  amount: Amount;
  payee: Payee;
  shipping: Shipping;
  payments: Payments;
}

export interface Payer {
  name: Name;
  email_address: string;
  payer_id: string;
  address: Address;
}

export interface Links {
  href: string;
  rel: string;
  method: string;
}
