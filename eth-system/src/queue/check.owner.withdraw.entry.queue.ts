import Queue, { Job } from 'bull';
import Config from '../config';
import { getManager } from 'typeorm';
import OwnerWithdrawEntryService from '../service/owner.withdraw.entry.service';

const CheckOwnerWithdrawEntryQueue = new Queue('checkOwnerWithdrawTxnQueue', Config.REDIS_DSN);
CheckOwnerWithdrawEntryQueue.process('checkOwnerWithdrawTxnQueue', 5, async (job: Job<{ txnHash: string }>, done) => {
  const ownerWithdrawEntryService = new OwnerWithdrawEntryService();
  try {
    await getManager().transaction(async (em) => {
      const criteria = { txnHash: job.data.txnHash };
      const entry = await ownerWithdrawEntryService.findWillConfirmEntry(criteria);

      if (!entry) {
        throw new Error('Can not find owner_withdraw_entry');
      }

      // 確認訂單
      await ownerWithdrawEntryService.confirmEntry(em, entry);

      return entry;
    });

    return done();
  } catch (e) {
    console.log(e);
    return done(e);
  }
});

export default CheckOwnerWithdrawEntryQueue;
