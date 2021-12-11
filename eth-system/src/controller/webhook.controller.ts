import { NextFunction, Request, Response } from 'express';
import Web3Service from '../service/web3.service';
import CheckTxnQueue from '../queue/check.txn.queue';
import config from '../config';
import { Contract } from '../entity/Contract';
import CheckWithdrawTxnQueue from '../queue/check.withdraw.txn.queue';
import { CONFIRM_TIME_PER_BLOCK, SECOND } from '../lib/constant';
import { WithdrawEntry } from '../entity/WithdrawEntry';
import { OwnerWithdrawEntry } from '../entity/OwnerWithdrawEntry';
import TelegramQueue from '../queue/telegram.queue';
import CheckOwnerWithdrawEntryQueue from '../queue/check.owner.withdraw.entry.queue';

export interface RawContract {
  rawValue: string;
  address: string;
  decimals: number;
}

export interface IActivity {
  fromAddress: string;
  toAddress: string;
  blockNum: string;
  category: string;
  hash: string;
  value: number;
  erc721TokenId?: string;
  asset: string;
  rawContract: RawContract;
  typeTraceAddress?: string;
}

class WebhookController {
  web3Service: Web3Service;

  constructor() {
    this.web3Service = new Web3Service();
  }

  alchemyWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { activity } = req.body;
    const contract = await Contract.findOne({ cache: true });

    for (let i = 0; i < activity.length; i++) {
      const a = activity[i];
      const alcContractAddress = a?.rawContract?.address;

      // 檢查是不是usdt合約
      if (alcContractAddress && alcContractAddress.toLowerCase() === config.USDT_ADDRESS.toLowerCase()) {
        const toAddress = a.toAddress.toLowerCase();
        const fromAddress = a.fromAddress.toLowerCase();
        const merchantContractAddress = contract.address.toLowerCase();

        // 入款
        if (toAddress === merchantContractAddress) {
          CheckTxnQueue.add(
            CheckTxnQueue.name,
            {
              contractAddress: contract.address,
              fromAddress: a.fromAddress,
              txnHash: a.hash,
              amount: a.value,
              type: 'deposit',
            },
            { delay: 12 * CONFIRM_TIME_PER_BLOCK, attempts: 5, backoff: 15 * SECOND },
          );
        }

        // 出款
        if (fromAddress === merchantContractAddress) {
          const withdrawEntry = await WithdrawEntry.findOne({ where: { txnHash: a.hash } });
          if (withdrawEntry) {
            CheckWithdrawTxnQueue.add(
              CheckWithdrawTxnQueue.name,
              { txnHash: a.hash },
              { delay: 12 * CONFIRM_TIME_PER_BLOCK, attempts: 5, backoff: 15 * SECOND },
            );
          }

          // 業主提現
          const ownerWithdrawEntry = await OwnerWithdrawEntry.findOne({ where: { txnHash: a.hash } });
          if (ownerWithdrawEntry) {
            CheckOwnerWithdrawEntryQueue.add(
              CheckOwnerWithdrawEntryQueue.name,
              { txnHash: a.hash },
              { delay: 12 * CONFIRM_TIME_PER_BLOCK, attempts: 5, backoff: 15 * SECOND },
            );
          }

          if (!withdrawEntry && !ownerWithdrawEntry) {
            const msg = 'xxx';
            TelegramQueue.add(TelegramQueue.name, { msg });
          }
        }
      }
    }
    res.json({ ok: true });
    next();
  };
}

export default WebhookController;
