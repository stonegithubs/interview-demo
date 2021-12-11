import Queue, { Job } from 'bull';
import Config from '../config';
import config from '../config';
import { WithdrawEntry } from '../entity/WithdrawEntry';
import numeral from 'numeral';
import Web3 from 'web3';
import Web3Exception from '../exception/web3.exception';
import { TransactionReceipt } from 'web3-core';

function getRealAmount(withdrawEntry: WithdrawEntry): string {
  const cryptoAmount = numeral(withdrawEntry.cryptoAmount);
  const fee = numeral(withdrawEntry.fee);
  return cryptoAmount.subtract(fee.value()).format('0.000000');
}

const TradeQueue = new Queue('traderQueue', Config.REDIS_DSN);
TradeQueue.process('traderQueue', 1, async (job: Job<{ txnHash: string, signedTransaction: string }>, done) => {
  const { signedTransaction: signed, txnHash } = job.data;
  const web3 = new Web3(config.INFURA_HTTPS);

  try {
    await web3.eth.sendSignedTransaction(signed)
      // todo check how to implement

      .on('error', (err) => {
        console.log('on error');
        console.log(err);
        done(new Web3Exception({ msg: err.message, code: 'W000001' }));
      })
      .then((receipt: TransactionReceipt) => {
        job.log(JSON.stringify(receipt));
        done();
      });
  } catch (err) {
    console.log(err);
    job.log(err.message);
    done(new Web3Exception({ msg: err.message, code: 'W000002' }));
  }

});
export default TradeQueue;
