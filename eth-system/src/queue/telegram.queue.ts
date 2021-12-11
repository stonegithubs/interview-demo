import Queue, { Job } from 'bull';
import Config from '../config';
import { sendMsg } from '../lib/telegram';

const TelegramQueue = new Queue('telegramQueue', Config.REDIS_DSN);
TelegramQueue.process('telegramQueue', 1, async (job: Job<{ msg: string }>, done) => {
  try {
    await sendMsg(job.data.msg);
    return done();
  } catch (e) {
    return done(e);
  }
});
export default TelegramQueue;
