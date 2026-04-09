/*
 * @name: Kary
 * @Date: 2021-12-01 14:46:12
 * @Description:
 */
import axios, {AxiosPromise, AxiosRequestConfig, AxiosResponse} from 'axios';
import {authToken, logout} from "./index.ts";

// 创建axios实例
const API = axios.create({
  validateStatus(status) {
    return status >= 200 && status < 504 // 设置默认的合法的状态
  },
  baseURL: import.meta.env.VITE_APP_BASE_API as string,
  timeout: 10 * 1000, // 请求超时时间
})

API.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    config.headers!['Accept-Language'] = 'zh-CN';
    config.headers!['Content-Type'] = 'application/json';
    config.headers!['Accept'] = 'application/json';
    config.headers!['Authorization'] = 'Bearer ' + authToken.value;
    if (config.method === 'post') {
      if (!config.data) {
        config.data = {}
      }
    }
    return config
  },
  error => {
    return Promise.reject({
      code: null,
      data: null,
      message: error
    })
  }
)

API.interceptors.response.use(
  response => {
    const message = response?.data?.message || response.message || "请求失败";
    if ([200, 201].includes(response.status) && response.data?.code === 0) {
      return Promise.resolve({
        code: response?.data?.code,
        data: response?.data?.data,
        message: response?.data?.message || "success"
      })
    }
    if ([401].includes(response.status)) {
      window['$message'].error('登录过期')
      logout()
      location.href = '/login';
      return Promise.reject({
        code: null,
        data: null,
        message: message
      })
    }
    window['$message'].error(message)
    return Promise.reject({
      code: response.data?.code,
      data: response.data,
      message: message
    })
  },
  err => {
    return Promise.reject({
      code: null,
      data: null,
      message: err || "请求失败"
    })
  }
)

export type APIResponseType<T> = {
  code: number | null;
  data: T | null;
  message: string,
}
export {
  API
}
