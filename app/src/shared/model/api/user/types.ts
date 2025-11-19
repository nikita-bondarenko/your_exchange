import { DirectionType, RequestCurrency } from "../exchange";

export type UserListApiResponse =
  /** status 200 Информация о пользователе и его транзакциях */ {
    user_data?: {
      profile_picture?: string;
      name?: string;
      email?: string;
      phone?: string;
      mail_request?: boolean;
    };
    requests_in_process?: ExchangeRequest[];
    requests_all?: ExchangeRequest[];
    card?: string;
    city?: string;
  };
export type UserListApiArg = {
  /** ID пользователя */
  userId?: number;
};
export type UserUpdateCreateApiResponse =
  /** status 200 Успешное обновление */ {
    user_id: number;
    full_name?: string;
    phone?: string;
    email?: string;
  };
export type UserUpdateCreateApiArg = {
  // body: {
    /** ID пользователя */
    user_id: number;
    /** ФИО пользователя */
    full_name?: string;
    /** Номер телефона */
    phone?: string;
    /** Электронная почта */
    email?: string;

    has_consented?: boolean;
  // };
};
export type UsersRequisites = {
  user: number;
  type_req?: ("BANK" | "COIN") | null;
  get_to?: string | null;
};

export type CheckMailApiArg = {
  user_id: number;
};

export type CheckMailApiResponse = {
  mail_required: boolean;
};

export type CheckConsentApiArg = {
  user_id: number;
};

export type CheckConsentApiResponse = {
  consent_required: boolean;
};

export type ExchangeRequest = {
  id?: string;
  date?: string;
  course?: number;
  wallet?: string;
  direction_type: DirectionType;
  card?: string;
  city?: string;
  currency_give?: RequestCurrency;
  currency_get?: RequestCurrency;
};
