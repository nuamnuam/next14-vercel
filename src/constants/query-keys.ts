import { OrderHistoryParams } from '@/requests/market/orderHistoryQuery';
import { BalancesParams } from '@/requests/panel/wallet/getBalancesList';

const AUTH = {
  LOGIN: ['login'] as const,
  LOGOUT: ['logout'] as const,
  FORGOT_PASS: ['forgot-password'] as const,
  CHECK_OTP_CODE: ['register-otp-check'] as const,
  TWO_STEP_VERIFICATION: ['login-two-step'] as const,
  RESET_PASSWORD: ['reset-password'] as const,
  RESEND_OTP: ['login-resend-otp'] as const,
  CAPTCHA: ['captcha'] as const,
  SETTING_ALERTS: ['setting-alerts'] as const,
};

const MARKET = {
  CURRENCIES: (args: Record<string, any>) => ['currencies', args],
  COIN_CATEGORIES: ['coin-categories'] as const,
  FAVORITE_CURRENCY: ['favorite-currency'] as const,
  COIN: (id: string) => ['coin', id] as const,
  ORDER_COMMISSION: (pairId: number) => ['order-commission', pairId],
  GET_ORDER_HISTORIES: (params: OrderHistoryParams) => [
    'get-order-histories',
    params,
  ],
};

const TICKET = {
  CLOSE_TICKET: ['close-ticket'] as const,
  GET_TICKETS: (selectedStatus: number | string, page?: number) => [
    'get-tickets',
    selectedStatus,
    page,
  ],
  GET_DEPARTMENTS: ['get-departments'],
  GET_DEPARTMENT_BY_ID: ['get-department-by-id'],
  GET_SINGLE_TICKET: ['get-single-ticket'],
  ANSWER_TICKET: ['answer-ticket'],
  REGISTER_NEW_TICKET: ['register-new-ticket'],
  SEND_REVIEW: ['send-review'],
  GET_REVIEW: ['show-review'],
};

const MESSAGES = {
  GET_MESSAGES: (page?: number, type?: string) =>
    ['get-all-messages', page, type] as const,
};

const ADVANCE_MARKET = {
  GET_PAIRS: (
    search?: string | null,
    page?: number,
    per_page?: number,
    base_asset?: string,
  ) =>
    ['get-advance-market-pairs', search, page, per_page, base_asset] as const,
  GET_TOP_COINS: (sort_by?: string, sort_type?: string) => [
    'advance-market-top-coins',
    sort_by,
    sort_type,
  ],
};

const ADVANCE_TRADE = {
  GET_RECENT_TRADES: (pair?: string) => ['get-recent-trades', pair] as const,
  GET_ORDER_BOOK: (pair?: string) => ['get-order-book', pair] as const,
};

export const STRAPI = {
  JOB_VACANCIES_DETAILS: (id: string) => ['job-opportunity-details', id],
  JOB_VACANCIES_PAGE: ['job-vacancies-page'],
  JOB_OPPORTUNITIES_LIST: ['job-opportunities-list'],
  HELP_CAT: (id: string | undefined) => ['get-help-cat', id],
  HELPS_CATS: ['get-help-cats'],
  HELP_DETAILS: (id: string | undefined) => ['get-help-details', id],
  ANNOUNCEMENTS_HELPS: ['get-announcement-help'],
  FAQ_PAGE: ['get-faq-page'],
  FAQS_CONTENT: (
    id?: number | undefined | string,
    page?: number,
    pageSize?: number,
  ) => ['get-faqs', id, page, pageSize],
  FAQ_CATS: ['get-faq-cats'],
  FAQ_CAT: (id: string | undefined) => ['get-faq-cat', id],
  ANNOUNCEMENT_CATS: ['get-announcement-cats'],
  ANNOUNCEMENT_PAGE: ['get-announcement-page'],
  ANNOUNCEMENT_CAT: (id: string | undefined) => ['get-announcement-cat', id],
  ANNOUNCEMENT_DETAILS: (id: string | undefined) => [
    'get-announcement-details',
    id,
  ],
  ANNOUNCEMENTS: (id?: number | undefined | string, page?: number) => [
    'get-announcements',
    id,
    page,
  ],
  HELP_PAGE: ['get-help-page'],
};

const WALLET = {
  GET_GLOBAL_BALANCE: (params: BalancesParams) => [
    'get-global-balance',
    params,
  ],
  GET_GLOBAL_BALANCES_LIST: (params: BalancesParams) => [
    'get-global-balances-list',
    params,
  ],
  GET_BALANCE_HISTORY: 'get-balance-history',
  GET_BALANCE: (asset: string) => ['get-balance', asset],
  GET_INFINITE_ASSETS: 'get-infinite-balances',
};

const CONNECTION = {
  GLOBAL: 'get-internet-connectivity',
};

const LANGUAGE = {
  TRANSLATION: (scope?: string, locale?: string) => [
    'get-translation',
    scope,
    locale,
  ],
};

const SECURITY = {
  ACTIVE_DEVICES: (page: number) => ['get-active-devices', page],
};

const SETTINGS = {
  BANKS: 'get-banks',
};

const QUERY_KEYS = Object.freeze({
  ...AUTH,
  ...MARKET,
  ...TICKET,
  ...MESSAGES,
  ...ADVANCE_MARKET,
  ...ADVANCE_TRADE,
  ...WALLET,
  ...CONNECTION,
  ...LANGUAGE,
  ...SECURITY,
  ...SETTINGS,
});

export default QUERY_KEYS;
