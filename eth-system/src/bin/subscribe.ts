import config from '../config';
import Web3 from 'web3';
import { createConnection } from 'typeorm';
import { Contract } from '../entity/Contract';
import CheckTxnQueue from '../queue/check.txn.queue';
import { Log } from 'web3-core';
import { CONFIRM_TIME_PER_BLOCK, SECOND } from '../lib/constant';
import CheckWithdrawTxnQueue from '../queue/check.withdraw.txn.queue';
import TelegramQueue from '../queue/telegram.queue';
import Web3WsProvider from 'web3-providers-ws';

const options = {
  timeout: 30000, // ms
  clientConfig: {
    // Useful if requests are large
    maxReceivedFrameSize: 100000000,   // bytes - default: 1MiB
    maxReceivedMessageSize: 100000000, // bytes - default: 8MiB
    // Useful to keep a connection alive
    keepalive: true,
    keepaliveInterval: 60000 // ms
  },
  // Enable auto reconnection
  reconnect: {
    auto: true,
    delay: 5000, // ms
    maxAttempts: 5,
    onTimeout: false
  }
};
// @ts-ignore
const web3 = new Web3(new Web3WsProvider(config.INFURA_WSS, options));

function getInfo(log: Log): { fromAddress: string; toAddress: string; amount: number } {
  const fromAddress = log.topics[1].split('000000000000000000000000').join('').toLowerCase();
  const toAddress = log.topics[2].split('000000000000000000000000').join('').toLowerCase();
  const amount = web3.utils.hexToNumber(log.data) / 10 ** 6;
  return { fromAddress, toAddress, amount };
}

process.on('SIGINT', function () {
  console.log('Subscribe Infura is closing...');
  process.exit(0);
});

createConnection().then(async () => {
  console.log('[bin/subscribe]Start subscribing USDT transfer! ');
  console.log('subscribe 先暫停 先用alchemy就好');
  return;
  const contract = await Contract.findOne();
  const contractAddress = contract.address.toLowerCase();
  const topic = web3.eth.abi.encodeEventSignature('Transfer(address,address,uint256)');
  web3.eth.subscribe('logs', {
    address: config.USDT_ADDRESS,
    topics: [topic],
  }, (err, log) => {
    if (err) {
      TelegramQueue.add(TelegramQueue.name, { msg: err.message });
      throw err;
    }

    const { fromAddress, toAddress, amount } = getInfo(log);
    // 打到合約錢包
    if (toAddress === contractAddress) {
      // delay12個block時間，失敗的話重試5次，每次重試間隔15秒
      CheckTxnQueue.add(
        CheckTxnQueue.name,
        {
          contractAddress: contract.address,
          fromAddress,
          txnHash: log.transactionHash,
          amount,
        },
        { delay: 12 * CONFIRM_TIME_PER_BLOCK, attempts: 5, backoff: 15 * SECOND },
      );
    }

    // 出款
    if (fromAddress === contractAddress) {
      CheckWithdrawTxnQueue.add(
        CheckWithdrawTxnQueue.name,
        { txnHash: log.transactionHash },
        { delay: 12 * CONFIRM_TIME_PER_BLOCK, attempts: 5, backoff: 15 * SECOND },
      );
    }
  })
    .on('changed', function (log) {
      // TODO 待測試
    });
});
