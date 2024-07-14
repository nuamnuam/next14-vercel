export const CAPTCHA_ENDPOINTS = {
  DEFAULT: '/captcha',
};

export const LOGIN_ENDPOINTS = {
  LOGIN_WITH_PASSWORD: '/auth/login',
  LOGIN_WITH_EMAIL: '/auth/login/email',
  FORGOT_PASSWORD: '/auth/password/forget',
  FORGOT_PASSWORD_WITH_EMAIL: '/auth/password/forget/email',
  RESET_PASSWORD: '/auth/password/reset',
  CHECK_MOBILE_OTP: '/auth/password/check',
  CHECK_EMAIL_OTP: '/auth/password/check/email',
  LOGOUT: '/auth/logout',
  PRIVATE_CHANNEL: '/broadcasting/auth',
};
export const REGISTER_ENDPOINTS = {
  SIGNUP: '/auth/register',
  CHECK_CODE: '/auth/register/check-code',
  RESEND_CODE: '/auth/register/resend-code',
};

export const COMMON_ENDPOINTS = {
  LOGOUT: '/auth/logout',
  CAPTCHA: '/captcha',
};

export const TWOFA_ENDPOINTS = {
  CHECK: '/auth/two-step/check',
  RESEND: '/auth/two-step/resend',
};

export const MYACCOUNT_ENDPOINTS = {
  EDIT_SETTING: '/v1/account/profile/update-settings',
  EDIT_PROFILE: '/v1/account/profile/edit',
  GET_PROFILE: '/v1/account/profile',
  NEW_EMAIL: '/v1/account/profile/email',
  CHECK_NEW_EMAIL: '/v1/account/profile/email/check/new',
  EDIT_EMAIL: '/v1/account/profile/email/edit',
  CHECK_CURRENT_EMAIL: '/v1/account/profile/email/check/current',
  RESEND_NEW_EMAIL: '/v1/account/profile/email/resend/new',
  RESEND_CURRENT_EMAIL: '/v1/account/profile/email/resend/current',
  CHECK_NEW_MOBILE_NUMBER: '/auth/change-mobile/change',
  CHECK_CURRENT_MOBILE: '/auth/change-mobile/check/current',
  CHECk_NEW_MOBILE: '/auth/change-mobile/check/new',
};

export const KYC = {
  ADD_CARD_NUMBER: '/v1/account/card-numbers',
  UPLOAD_NATIONAL_CARD_IMAGE: '/v1/account/profile/upload/national-card-image',
  UPLOAD_FACE_IMAGE: '/v1/account/profile/upload/face-image',
  UPLOAD_FACE_VIDEO: '/v1/account/profile/upload/face-video',
  INQUERY_BANK_CARD: '/v1/account/card-numbers/inquiry',
  MIGRATE_USER: '/v1/migrated-user-verify-identity-info',
};

export const SECURITY = {
  CHANGE_PASSWORD: '/auth/change-password/change',
  CHANGE_PASSWORD_CHECK_OTP: '/auth/change-password/check',
  TWO_STEP_SHOW_2F: '/auth/two-step/show',
  TWO_STEP_CHANGE_GET_OTP: '/auth/two-step/change',
  CONFIRM_OPT_CODE: '/auth/two-step/change/check',
  GOOGLE_2FA_VERIFY: '/auth/two-step/change/google2fa/verify',
  GET_ACTIVITIES_ACTIONS: '/auth/activities/actions',
  GET_ACTIVITIES_LOGINS: '/auth/activities/logins',
  TERMINATE_DEVICE: '/activities/sessions/{sessionId}/terminate',
};

export const WALLET = {
  GET_BANK_CARDS: '/v1/account/card-numbers',
  GET_BANK_IBANS: '/v1/account/ibans',
  DELETE_BANK_CARD: '/v1/account/card-numbers',
  ADD_NEW_IBAN: '/v1/account/ibans',
  DELETE_IBAN: '/v1/account/ibans',
  GET_BALANCES_HISTORY: '/v1/wallet/balances-history',
  GET_BALANCES_DETAIL: '/v1/wallet/balances-detail',
  GET_BALANCES: '/v1/wallet/balances',
  GET_DEPOSIT_ADDRESS: '/v1/wallet/get-deposit-address',
  POST_DEPOSIT: '/v1/wallet/deposit',
  WITHDRAW_OTP: '/v1/wallet/withdraw',
  WITHDRAW_SUBMIT: '/v1/wallet/withdraw/resend',
  WITHDRAW_INTERNAL_OTP: '/v1/wallet/withdraw/internal',
  WITHDRAW_INTERNAL_SUBMIT: '/v1/wallet/withdraw/internal/resend',
  GET_TRASANCTIONS: '/v1/wallet/transactions',
  GET_TRASANCTION_DETAIL: (id: string) => `/v1/wallet/transactions/${id}`,
  GET_USER_LIMITATIONS: '/v1/account/limitations',
  WITHDRAW_FIAT_OTP: '/v1/fiat/withdraw/submit',
  WITHDRAW_FIAT_SUBMIT: '/v1/fiat/withdraw/resend',
  DEPOSIT_FIAT: '/v1/fiat/deposit',
  GET_FIAT_ID_DEPOSIT_INFO: '/v1/fiat/deposit-id',
  GET_SMALL_ASSETS: '/v1/wallet/small_assets',
  CONVERT_SMALL_ASSETS: '/v1/wallet/small_assets',
  CURRENCY_TRANSACTIONS: '/v1/wallet/transactions/currency_transactions',
};

export const PROFILE = {
  GET_PROFILE: '/v1/account/profile',
  POST_FIREBASE_TOKEN: '/v1/account/firebase',
  DELETE_FIREBASE_TOKEN: (id: string) => `/v1/account/firebase/${id}`,
  POST_IP: '/v1/download-page-visitors',
};

export const SETTINGS = {
  DEFAULT: '/setting',
  ALERTS: '/setting/alerts',
  BANKS: '/setting/bank-list',
};

export const INSTANT_TRADE = {
  POPULAR_CURRENCIES: '/v1/trade/otc/popular-currencies',
  SUBMIT_OTC_ORDER: '/v1/trade/otc/order',
  ORDER_COMMISSION: '/v1/trade/otc/commission',
  OTC_ORDER_DETAILS: '/v1/trade/otc/order-detail',
};

export const CONTACT_US = {
  POST_FORM: '/v1/contact-us',
};

export const MARKET = {
  GET_COIN_CATEGORIES: '/v1/market/categories',
  ORDER_COMMISSION: (pair: number) => `/v1/trade/otc/commission/${pair}`,
  SUBMIT_ORDER: '/v1/trade/otc/order',
  PUT_FAVORITE: '/v1/currencies/favorite',
  ORDER_HISTORY: '/v1/trade/order-history',
  ORDER_DETAIL: (order_id: number) => `/v1/trade/order/${order_id}`,
  DELETE_ORDER: '/v1/trade/otc/order-cancellation',
  USER_STATS: '/v1/trade/order/user-stats',
  DELETE_P2P_ORDER: '/v1/trade/p2p/order-cancellation',
  GET_PAIRS: 'v1/market/all-market-new',
  GET_RECENT_TRADES: '/v1/trade/p2p/recent-trades',
  GET_ORDER_BOOK: '/v1/trade/p2p/orderbook',
  SUBMIT_P2P_Order: '/v1/trade/p2p/order',
};

export const STRAPI = {
  MARKET: '/market?populate=deep',
  CONTACT_US: '/contact-us?populate=deep',
  TERMS_AND_CONDITIONS: '/terms-page?populate=deep',
  APPLICATION: '/application-page?populate=deep',
  HOME: '/landing-page?populate=deep',
  ANNOUNCEMENTS: '/announcements?populate=deep',
  aboutUs: '/about-us?populate=deep',
  FOOTER: '/footer?populate=deep',
  JOB_VACANCIES_PAGE: '/job-vacancies-page?populate=deep',
  JOB_VACANCIES: '/job-vacancies?populate=deep',
  JOB_VACANCY_DETAILS: (id: string) => `/job-vacancies/${id}?populate=deep`,
  COMMISSION: '/commission-page?populate=deep',
  GET_SINGLE_CURRENCY: (symbol: string) =>
    `/currencies?populate=deep&filters[symbol]=${symbol}`,
  ANNOUNCEMENTS_CATS: '/announcement-cats?populate=deep',
  ANNOUNCEMENT_PAGE: '/announcement-page?populate=deep',
  HELPS_CATS: '/categories?populate=deep',
  HELP_PAGE: '/help-page?populate=deep',
  HELPS: '/helps?populate=deep',
  HELP_DETAILS: (id: string | undefined) => `/helps/${id}?populate=deep`,
  ANNOUNCEMENT_BY_ID: (id: string | undefined) =>
    `/announcements/${id}?populate=deep`,
  HELP_CAT_BY_ID: (id: string | undefined) => `/categories/${id}?populate=deep`,
  FAQ_CAT_BY_ID: (id: string | undefined) =>
    `/faq-categories/${id}?populate=deep`,
  ANNOUNCEMENT_CAT_BY_ID: (id: string | undefined) =>
    `/announcement-cats/${id}?populate=deep`,
  FAQS: '/faqs?populate=deep',
  ANNOUNCEMENT_BY_CATEGORY_ID: '/announcements?populate=deep',
  FAQ_PAGE: '/faq-page?populate=deep',
  FAQS_CATS: '/faq-categories?populate=deep',
  REFERRAL: '/referral-page?populate=deep',
  DASHBOARD_BANNERS:
    '/banner-managments?sort=updatedAt:desc&pagination[pageSize]=1&populate=deep',
};

export const CURRENCY = {
  LIST: '/v1/currencies',
  GET_SINGLE_CURRENCY: (symbol: string) => `/v1/currencies/${symbol}`,
  GET_SINGLE_CURRENCY_WITH_SLUG: (slug: string) =>
    `/v1/currencies?slug=${slug}`,
  FAVORITE_COIN: '/v1/currencies/favorite',
};

export const COMMISSION = {
  COMMISSION_LEVELS: '/v1/commission_levels',
};

export const TICKET = {
  GET_DEPARTMENTS: '/v1/tickets/departments',
  ALL_TICKET: '/v1/tickets/',
  ANSWER_TICKET: '/v1/tickets/items',
  SEND_REVIEW: '/v1/tickets/reviews',
  GET_REVIEW: (id: number | string) => `/v1/tickets/${id}/review`,
  GET_DEPARTMENT_BY_ID:
    '/v1/tickets/departments/subjects?ticket_department_id=',
};

export const REFERRAL = {
  LEVELS_LIST: '/v1/account/referrals/level-list',
  INVITE_CODE: '/v1/account/referrals/invite-code',
  INVITED_CODE_DETAILS: (id: string) =>
    `/v1/account/referrals/invite-code/${id}`,
  REFERRAL_INFO: '/v1/account/referrals/info',
  INVITED_USER_LIST: '/v1/account/referrals/invited-user-list',
  HIGHEST_EARNING: '/v1/account/referrals/highest-earning-invitees-list',
  GIFTS_LIST: '/v1/account/referrals/gift-lists',
  SET_REFERRAL_CODE: '/v1/account/set-referral-code',
  REGISTER_INVITE_CODE: '/v1/account/referrals/invite-code',
  UPDATE_INVITE_CODE: (id: string) => `/v1/account/referrals/invite-code/${id}`,
};

export const MESSAGES = {
  ALL: '/v1/messages',
  READ_ALL: '/v1/account/notifications/read-all',
};

export const BLOGS = {
  DEFAULT: '/v1/blog-news',
};
