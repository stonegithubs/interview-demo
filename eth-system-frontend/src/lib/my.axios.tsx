import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { TokenService } from '@/service/token.service';

export class MyAxios {
  static instance: AxiosInstance = axios.create();

  static async http(options: AxiosRequestConfig) {
    const token = TokenService.getAuthToken();
    MyAxios.instance.defaults.headers.common = { 'Authorization': `Bearer ${token}` };

    return await MyAxios.instance(options).then(res => res.data).catch(err => {
      // todo global message顯示在畫面上方
      const errMsg = err.response?.data?.code + ' ' + err.response?.data?.msg;
      throw new Error(errMsg || 'Unknown error');
    });
  }
}
