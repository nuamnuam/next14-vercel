import Router from 'next/router';
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import qs from 'qs';
import Cookies from 'js-cookie';

import { showToast } from '@/components/ToastProvider';
import { authStore } from '@/store';

import getLang from './get-lang';

const ignoredNotificationsEndpoints = [
  '/auth/password/check',
  '/auth/password/check/email',
  '/auth/register/check-code',
  '/auth/two-step/check',
  '/auth/change-password/check',
  '/auth/two-step/change/check',
  '/v1/wallet/withdraw/internal',
  '/v1/fiat/withdraw/submit',
  'health/check',
];

const [global] = getLang(['global']);

/**
 * @class Base
 * @abstract
 */
abstract class Base {
  /**
   * @static
   * @protected
   * @memberof Base
   */
  protected static DEFAULT_CONFIG: AxiosRequestConfig = {
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    timeoutErrorMessage: global.timeoutError,
    paramsSerializer: (params: string) =>
      qs.stringify(params, { indices: false }),
  };

  /**
   * @static
   * @protected
   * @memberof Base
   */
  protected static instance: AxiosInstance = axios.create(this.DEFAULT_CONFIG);

  /**
   * @param {string} token
   * @returns {void}
   * @memberof Base
   * @static
   */
  static setToken(token: string): void {
    this.instance.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  /**
   * @param {string} token
   * @returns {void}
   * @memberof Base
   * @static
   */
  static setPWA(): void {
    this.instance.defaults.params = {};
    this.instance.defaults.params.platform = 'pwa';
  }

  /**
   * @param {string} token
   * @returns {void}
   * @memberof Base
   * @static
   */
  static resetPWA(): void {
    this.instance.defaults.params = {};
    this.instance.defaults.params.platform = undefined;
  }

  /**
   * @returns {void}
   * @memberof Base
   * @static
   */
  static removeToken(): void {
    this.instance.defaults.headers.common.Authorization = '';
  }
}

/**
 * @class Request
 * @abstract
 */
abstract class Request extends Base {
  /**
   * @param {string} url
   * @param {AxiosRequestConfig} [config]
   * @static
   * @memberof Request
   */
  static get<T>(url: string, config?: AxiosRequestConfig) {
    return this.send<T>(url, {
      ...config,
      method: 'get',
      headers: {
        ...config?.headers,
        'Content-Type': 'application/json, text/plain, */*',
        Accept: 'application/json, text/plain, */*',
      },
    });
  }

  /**
   * @param {string} url
   * @param {AxiosRequestConfig} [config]
   * @static
   * @memberof Request
   */
  static option<T>(url: string, config?: AxiosRequestConfig) {
    return this.send<T>(url, {
      ...config,
      method: 'options',
      headers: {
        ...config?.headers,
        'Content-Type': 'application/json, text/plain, */*',
        Accept: 'application/json, text/plain, */*',
      },
    });
  }

  /**
   * @param {string} url
   * @param {any} [data]
   * @param {AxiosRequestConfig} [config]
   * @static
   * @memberof Request
   */
  static post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.send<T>(url, { ...config, method: 'post', data });
  }

  /**
   * @param {string} url
   * @param {any} [data]
   * @param {AxiosRequestConfig} [config]
   * @static
   * @memberof Request
   */
  static put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.send<T>(url, { ...config, method: 'put', data });
  }

  /**
   * @param {string} url
   * @param {AxiosRequestConfig} [config]
   * @static
   * @memberof Request
   */
  static delete<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.send<T>(url, { ...config, method: 'delete', data });
  }

  /**
   * @param {string} url
   * @param {any} [data]
   * @param {AxiosRequestConfig} [config]
   * @static
   * @memberof Request
   */
  static patch<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.send<T>(url, { ...config, method: 'patch', data });
  }

  /**
   * @param {string} url
   * @param {AxiosRequestConfig} [config]
   * @static
   * @private
   * @memberof Request
   */
  private static send<T>(url: string, config?: AxiosRequestConfig) {
    const shouldIgnoreNotification = ignoredNotificationsEndpoints.some(
      (endpoint) => url === endpoint,
    );

    return async () => {
      try {
        const token = Cookies.get('token');
        if (token)
          this.instance.defaults.headers.common.Authorization = `Bearer ${token}`;

        const conf = { ...this.DEFAULT_CONFIG, ...config };
        const response = await Request.instance.request<T>({
          ...conf,
          url,
        });
        return response.data;
      } catch (error: any) {
        if (error?.response?.status === 401) {
          this.handle401Error(error?.response?.data);
        } else if (
          error?.response?.data?.result &&
          !Array.isArray(error?.response?.data?.result) &&
          !shouldIgnoreNotification
        ) {
          const errors = error?.response?.data?.result;
          const finalError: string[] = [];
          Object.values(errors).forEach((item) => {
            finalError.push(item as string);
          });
          showToast.danger(finalError);
        } else if (shouldIgnoreNotification) {
          throw error?.response?.data ?? error;
        } else if (error?.response?.data?.message) {
          showToast.danger(error?.response?.data?.message);
        } else if (error?.response?.status >= 500) {
          showToast.danger(global.serverError);
        }
        throw error?.response?.data ?? error;
      }
    };
  }

  private static handle401Error(error: any) {
    authStore.setState({ token: '' });
    authStore.persist.clearStorage();
    Cookies.remove('token');
    localStorage.clear();
    if (Router.pathname.startsWith('/panel')) {
      Router.push('/auth/login');
    }
    throw { ...error, message: null, result: null };
  }
}

export default Request;
