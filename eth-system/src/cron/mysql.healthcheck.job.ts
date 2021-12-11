import { CronJob } from 'cron';
import TelegramQueue from '../queue/telegram.queue';
import { getConnection } from 'typeorm';

const MysqlHealthCheckJob = new CronJob(
  '15 * * * * *',
  async function () {
    try {
      const conn = await getConnection();
      await conn.query('select 1');
    } catch (err) {
      TelegramQueue.add(TelegramQueue.name, { msg: 'Mysql is not connected, err: ' + err.message });
      console.error(err);
    }
  },
  null,
  false,
  'America/Los_Angeles',
);

export default MysqlHealthCheckJob;
