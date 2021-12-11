import { CronJob } from 'cron';
import MyRedis from '../lib/my.redis';
import TelegramQueue from '../queue/telegram.queue';

const RedisHealthCheckJob = new CronJob(
  '9 * * * * *',
  async function () {
    const redisClient = new MyRedis();
    try {
      await redisClient.ping();
    } catch (err) {
      TelegramQueue.add(TelegramQueue.name, { msg: 'Redis is not connected, err: ' + err.message });
      console.error(err);
    }
  },
  null,
  false,
  'America/Los_Angeles',
);

export default RedisHealthCheckJob;
