import CheckTxnQueue from './check.txn.queue';
import CheckWithdrawTxnQueue from './check.withdraw.txn.queue';
import TelegramQueue from './telegram.queue';
import dayjs from 'dayjs';
import TradeQueue from './trade.queue';
import CheckOwnerWithdrawEntryQueue from './check.owner.withdraw.entry.queue';

const queues = [
  CheckTxnQueue,
  TradeQueue,
  CheckWithdrawTxnQueue,
  TelegramQueue,
  CheckOwnerWithdrawEntryQueue,
];

queues.forEach(q => {
  q.on('failed', async (job, err) => {
    if (job.queue.name !== TelegramQueue.name) {
      const msg = [
        `[${dayjs(job.timestamp).format('YYYY-MM-DD HH:mm:ss')}]`,
        '[Queue]: ' + job.queue.name,
        '[Error]: ' + err.message,
        '[ID]: ' + job.id,
        '[Data]: ' + JSON.stringify(job.data),
      ].join('\n');

      TelegramQueue.add(TelegramQueue.name, { msg });
    }
  });
});

export default queues;
