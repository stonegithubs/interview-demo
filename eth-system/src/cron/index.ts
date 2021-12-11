import rateJob from './rate.job';
import deleteRateJob from './delete.rate.job';
import gasPriceJob from './gas.price.job';
import RedisHealthCheckJob from './redis.healthcheck.job';
import MysqlHealthCheckJob from './mysql.healthcheck.job';

function startCronJob(): void {
  if(process.env.NODE_ENV === 'prod') {
    console.log('Start cronjob');
    RedisHealthCheckJob.start();
    rateJob.start();
    deleteRateJob.start();
    gasPriceJob.start();
    MysqlHealthCheckJob.start();
  }
}

export default startCronJob;
