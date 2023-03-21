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

export interface Payment_source {
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

export interface Shippin {
  name: Name;
  address: Address;
}

export interface Seller_protectio {
  status: string;
  dispute_categories: string[];
}

export interface Gross_amount {
  currency_code: string;
  value: string;
}

export interface Paypal_fee {
  currency_code: string;
  value: string;
}

export interface Net_amount {
  currency_code: string;
  value: string;
}

export interface Seller_receivable_breakdow {
  gross_amount: Gross_amount;
  paypal_fee: Paypal_fee;
  net_amount: Net_amount;
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
  seller_protection: Seller_protection;
  seller_receivable_breakdown: Seller_receivable_breakdown;
  links: Links[];
  create_time: string;
  update_time: string;
}

export interface Payments {
  captures: Captures[];
}

export interface Purchase_units {
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

export interface PaypalOrderStatusRespons {
  id: string;
  intent: string;
  status: string;
  payment_source: Payment_source;
  purchase_units: Purchase_units[];
  payer: Payer;
  create_time: string;
  update_time: string;
  links: Links[];
}