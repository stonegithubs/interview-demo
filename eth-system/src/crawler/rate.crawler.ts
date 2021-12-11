import axios, { AxiosError, AxiosResponse } from 'axios';
import RateService from '../service/rate.service';
import { cronJobErrorLogger } from '../lib/logger';

const rateService = new RateService();

// TODO 改從資料庫撈要爬的幣別？
export function rateCrawler(): void {
  axios({
    method: 'get',
    url: 'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=cny',
  }).then((res: AxiosResponse) => {
    const r = ((1 / res.data?.tether?.cny) || 0).toString();

    // 太小不紀錄 可能api壞了
    if (r === '0') {
      return;
    }

    rateService.insert('CNY', 'USDT(ERC20)', r);

  }).catch((err: AxiosError) => {
    cronJobErrorLogger.error(undefined, {
      cronjob: 'rateCrawler',
      errName: err.name,
      msg: err?.message || 'get gas price failed',
      url: err.config.url,
    });
  });
}
