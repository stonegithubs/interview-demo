import Queue from 'bull';
import Config from '../config';
import Web3Service from '../service/web3.service';
import { getManager } from 'typeorm';
import EntryService from '../service/entry.service';
import ContractCurrencyService from '../service/contract.currency.service';
import { SYSTEM_USER_ID } from '../lib/constant';

const CheckTxnQueue = new Queue('checkTxnQueue', Config.REDIS_DSN);
CheckTxnQueue.process('checkTxnQueue', 5, async (job, done) => {
  const web3Service = new Web3Service();
  const entryService = new EntryService();
  const contractCurrencyService = new ContractCurrencyService();
  const txn = await web3Service.getTransaction(job.data.txnHash);
  // txn消失
  if (!txn) {
    return done();
  }

  const receipt = await web3Service.getReceipt(job.data.txnHash);

  // 上鏈成功
  if (receipt.status) {
    try {
      const entry = await getManager().transaction(async (em) => {
        const criteria = {
          cryptoAmount: job.data.amount,
          toAddress: job.data.contractAddress,
        };
        const entry = await entryService.findWillConfirmEntry(criteria);

        // 找不到可匹配訂單 1:可能超時入款 2:訂單已完成,站點重複推送
        if (!entry) {
          job.log('Money in but no matched entry');
          return done(new Error('Money in but no matched entry'));
        }

        // 確認訂單
        await entryService.confirmEntry(em, entry, {
          txnHash: job.data.txnHash,
          fromAddress: job.data.fromAddress,
          userId: SYSTEM_USER_ID,
        });

        // 加錢到錢包
        await contractCurrencyService.increaseWithEntryConfirm(
          em,
          job.data.contractAddress,
          entry,
        );

        return entry;
      });

      if (!entry) {
        return done(new Error('Entry not found after entityManager'));
      }

      // todo push to queue

      done();

    } catch (e) {
      console.log(e);
      return done(e);
    }
  }

});

export default CheckTxnQueue;
