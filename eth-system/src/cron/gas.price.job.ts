import { CronJob } from 'cron';
import { gasPriceCrawler } from '../crawler/gas.price.crawler';

const gasPriceJob = new CronJob(
  '14 * * * * *',
  function () {
    gasPriceCrawler();
  },
  null,
  false,
  'America/Los_Angeles',
);

export default gasPriceJob;
