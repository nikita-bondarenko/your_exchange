export type PostCallingOperatorApiResponse =
  /** status 201 Успешное создание */ {
    status?: string;
    id?: number;
  };
export type PostCallingOperatorApiArg = {
  body: {
    /** ID пользователя */
    user_id: number;
  };
};
export type City = SecondaryPropertiesOption;
export type Bank = SecondaryPropertiesOption;
export type Network = SecondaryPropertiesOption;
export type Currency = {
  id: number;
  icon: string;
  name: string;
  cities: City[];
  banks: Bank[];
  networks: Network[];
};

export type GetCurrenciesGetApiResponse = Currency[];
export type GetCurrenciesGetApiArg = {
  /** Идентификатор отдаваемой валюты */
  giveCurrencyId: number;
  /** Тип валюты ('BANK' — банковская валюта, 'COIN' — криптовалюта, 'CASH' — наличная) */
  currencyType: string;
};

type SecondaryPropertiesOption = {
  name: string;
  /** ID сети */
  id: number;
};

export type GetDirectionInitialDataByDirectionTypeApiResponse =
  /** status 200 Успешный ответ */ {
    rate?: {
      /** ID направления обмена */
      id: number;
      /** Текущий курс обмена */
      course: number;
      /** Формат отображаемого курса */
      course_view: string;
      /** Минимальная сумма для обмена */
      currency_give_min_value: number;
      network: Network;
      city: City;
      bank: Bank;
      /** Тип направления обмена */
      direction_type: DirectionType;
      currency_give: Currency;
      currency_get: Currency;
course_title: string
    };
    currencies_give?: Currency[];
    currencies_get?: Currency[];
  };
export type GetDirectionInitialDataByDirectionTypeApiArg = {
  /** Тип направления обмена, состоящий из двух частей ('тип-отдаваемой-валюты - тип-получаемой-валюты') */
  directionType: string;
};
export type PostExchangesOtherApiResponse =
  /** status 201 Успешное создание */ {
    status?: string;
    id?: number;
  };
export type PostExchangesOtherApiArg = {
  body: {
    /** ID пользователя */
    user_id: number;
  };
};
export type ExchangesCreateApiResponse = /** status 201 Успешное создание */ {
  status?: string;
  exchange_id?: number;
};
export type ExchangesCreateApiArg = {
    user_id: number;
    direction_id: number
    currency_give_amount: number
    currency_get_amount: number
    card?: string
    wallet?: string
    phone?: string
    course_title: string
    promo_code?: string
};

export type Faq = {
  /** Сортировка */
  weight: number;
  /** Вопрос */
  title: string;
  /** Ответ */
  description: string;
}
export type FaqsListApiResponse = /** status 200 Успешный ответ */ {
  /** Сортировка */
  weight: number;
  /** Название раздела */
  title: string;
  /** Список вопросов и ответов */
  faqs: Faq[];
}[];
export type FaqsListApiArg = void;
export type GetGetRequisitesApiResponse = /** status 200  */ UsersRequisites[];
export type GetGetRequisitesApiArg = {
  /** ID пользователя */
  userId?: number;
  /** Тип реквизитов (BANK или COIN) */
  typeReq?: string;
};

export type DirectionType =
  | "COIN - BANK"
  | "COIN - CASH"
  | "BANK - COIN"
  | "CASH - COIN"

export type Rate = {
  /** ID направления обмена */
  id: number;
  /** Текущий курс обмена */
  course: number;
  /** Формат отображаемого курса */
  course_view: string;
  /** Минимальная сумма для обмена */
  currency_give_min_value: number;
  network: Network;
  city: City;
  bank: Bank;
  /** Тип направления обмена */
  direction_type: DirectionType;
  currency_give: Currency;
  currency_get: Currency;
course_title: string
};
export type GetJivoMessagesApiResponse = unknown;
export type GetJivoMessagesApiArg = void;
export type PostJivoMessagesApiResponse = unknown;
export type PostJivoMessagesApiArg = void;
export type RateListApiResponse = /** status 200 Успешный ответ */ {
  rate?: Rate;
};
export type RateListApiArg = {
  direction_type: DirectionType;
  currency_give_id: number;
  currency_get_id: number;
  network_id?: number;
  bank_id?: number;
  city_id?: number;
};

export type RequestCurrency = {
    amount?: number;
    name?: string;
    icon?: string;
    network?: string;
    bank?: string
  };

export type Request = {
    id?: string;
    date?: string;
    course?: number;
    wallet?: string
    direction_type: DirectionType
    card?: string
    city?: string
    currency_give?: RequestCurrency;
    currency_get?: RequestCurrency;
  };
export type UserListApiResponse =
  /** status 200 Информация о пользователе и его транзакциях */ {
    user_data?: {
      profile_picture?: string;
      name?: string;
      email?: string;
      phone?: string;
    };
    requests_in_process?: Request[];
    requests_all?: Request[];
    card?: string;
    city?: string;
  };
export type UserListApiArg = {
  /** ID пользователя */
  userId?: number;
};
export type UserUpdateCreateApiResponse =
  /** status 200 Успешное обновление */ {
    user_id?: number;
    full_name?: string;
    phone?: string;
    email?: string;
  };
export type UserUpdateCreateApiArg = {
  body: {
    /** ID пользователя */
    user_id: number;
    /** ФИО пользователя */
    full_name?: string;
    /** Номер телефона */
    phone?: string;
    /** Электронная почта */
    email?: string;
  };
};
export type UsersRequisites = {
  user: number;
  type_req?: ("BANK" | "COIN") | null;
  get_to?: string | null;
};


export type CheckPromocodeApiArg = {
  code: string
};

export type CheckPromocodeApiResponse= {
  detail: string
};
