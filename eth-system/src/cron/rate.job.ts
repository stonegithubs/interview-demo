import { CronJob } from 'cron';
import { rateCrawler } from '../crawler/rate.crawler';

const rateJob = new CronJob(
  '3 * * * * *',
  function () {
    rateCrawler();
  },
  null,
  false,
  'America/Los_Angeles',
);

export default rateJob;
