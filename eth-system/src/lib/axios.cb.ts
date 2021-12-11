import axios from 'axios';
import * as qs from 'qs';
import { callbackErrorLogger, callbackLogger } from './logger';

const instance = axios.create({
  timeout: 30 * 1000,
  headers: { 'X-Service': 'eth-system' },
  paramsSerializer: params => qs.stringify(params),
  transformRequest: [
    // data => qs.stringify(data),
    // ...axios.defaults.transformRequest,
  ],
});

instance.interceptors.response.use(function (response) {
  const { config: { url, method, headers, data: reqData }, data } = response;
  callbackLogger.info(undefined, { url, method, headers, request: reqData, response: data });
  return response;
}, function (error) {
  const { message, name, config: { url, method, headers, code, data } } = error.toJSON();
  callbackErrorLogger.error(undefined, { message, name, url, method, headers, code, request: data });

  return Promise.reject(error);
});

export default instance;
