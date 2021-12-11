import { CronJob } from 'cron';
import dayjs from 'dayjs';
import RateService from '../service/rate.service';

const deleteRateJob = new CronJob(
  '33 11 3 * * *',
  function () {
    const threeDaysAgo = dayjs().add(-3, 'day').format('YYYYMMDDHHmmss');
    const rateService = new RateService();
    rateService.deleteBefore(threeDaysAgo).then(res => {
      console.log(res);
    });
  },
  null,
  false,
  'America/Los_Angeles',
);

export default deleteRateJob;
