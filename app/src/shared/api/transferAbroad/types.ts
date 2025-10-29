// types/transferAbroad.ts
export type TransferOption = {
  id: number;
  icon: string;
  name: string;
  description: string;
};

export type TransferOptionsResponse = {
  individual: TransferOption[];
  legal_entity: TransferOption[];
};

export type TransferAbroadCurrency = {
  id: number;
  name: string;
  icon: string;
  limit?: number | null;
};

export type CurrenciesResponse = {
  currencies: TransferAbroadCurrency[];
};

export type CurrencySubOption = {
  id: number;
  name: string;
};

export type TransferDetailsResponse = {
  banks?: CurrencySubOption[];
  platforms?: CurrencySubOption[];
  countries?: CurrencySubOption[];
};

// POST bodies
export type InvoiceOrderBody = {
  transfer_type: 'individual' | 'legal_entity';
  currency_name: string;
  amount: number;
  country_name: string;
  task_description: string;
};

export type FTAOrderBody = {
  currency_name: string;
  amount: number;
  task_description: string;
  russian_company_requisites?: string;
  abroad_company_requisites?: string;
  file_1?: File;
  file_2?: File;
};

export type ChinesePlatformOrderBody = {
  currency_name: string;
  amount: number;
  platform_name: string;
};

export type AbroadCardOrderBody = {
  currency_name: string;
  amount: number;
  bank_name: string;
  card_number: string;
};

export type OrderResponse = {
  order_id: string;
};