import Queue, { Job } from 'bull';
import Config from '../config';
import { getManager } from 'typeorm';
import WithdrawEntryService from '../service/withdraw.entry.service';
import { SYSTEM_USER_ID } from '../lib/constant';

const CheckWithdrawTxnQueue = new Queue('checkWithdrawTxnQueue', Config.REDIS_DSN);
CheckWithdrawTxnQueue.process('checkWithdrawTxnQueue', 5, async (job: Job<{ txnHash: string }>, done) => {
  const withdrawService = new WithdrawEntryService();
  try {
    const withdrawEntry = await getManager().transaction(async (em) => {
      const criteria = { txnHash: job.data.txnHash };
      const entry = await withdrawService.findWillConfirmEntry(criteria);

      if (!entry) {
        throw new Error('Can not find withdraw_entry');
      }

      // 確認訂單
      await withdrawService.confirmEntry(em, entry, SYSTEM_USER_ID);

      return entry;
    });

    if (withdrawEntry) {
      // push queue
      return done();
    }

    done(new Error('WithdrawEntry not found after entityManager'));
  } catch (e) {
    console.log(e);
    return done(e);
  }
});

export default CheckWithdrawTxnQueue;
