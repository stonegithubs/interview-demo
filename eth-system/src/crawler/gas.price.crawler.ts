import axios, { AxiosError, AxiosResponse } from 'axios';
import config from '../config';
import GasPriceService from '../service/gas.price.service';
import { cronJobErrorLogger } from '../lib/logger';

export function gasPriceCrawler(): void {
  axios({
    method: 'get',
    url: `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${config.ETHERSCAN_API_KEY}`,
  }).then((res: AxiosResponse) => {
    const gasPriceService = new GasPriceService();
    const price = Number(res?.data?.result?.FastGasPrice) || 0;
    if (price <= 0) {
      return;
    }

    gasPriceService.uspsert(price);

  }).catch((err: AxiosError) => {
    cronJobErrorLogger.error(undefined, {
      cronjob: 'gasPriceCrawler',
      errName: err.name,
      msg: err?.message || 'get gas price failed',
      url: err.config.url,
    });
  });
}
