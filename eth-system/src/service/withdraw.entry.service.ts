import { Merchant } from '../entity/Merchant';
import { EntityManager, getCustomRepository, getManager } from 'typeorm';
import { Contract } from '../entity/Contract';
import HttpException from '../exception/http.exception';
import { Currency } from '../entity/Currency';
import { getIdDate, idGenerator } from '../lib/utils';
import { WithdrawEntry } from '../entity/WithdrawEntry';
import { ContractCurrency } from '../entity/ContractCurrency';
import dayjs from 'dayjs';
import { IEntryCriteria } from '../repository/types';
import WithdrawEntryRepository from '../repository/withdraw.entry.repository';

interface IWithdrawArgs {
  merchant: Merchant,
  currency: Currency,
  amount: number,
  cbUrl: string,
  toAddress: string,
  cbId: string,
  txnHash: string;
  gasPrice: number;
  cryptoAmount: string;
  realCryptoAmount: string;
  fee: string;
  rate: string;
}

class WithdrawEntryService {
  withdraw = async (em: EntityManager, withdrawArgs: IWithdrawArgs): Promise<WithdrawEntry> => {
    const {
      merchant,
      currency,
      amount,
      toAddress,
      cbUrl,
      cbId,
      txnHash,
      gasPrice,
      cryptoAmount,
      realCryptoAmount,
      fee,
      rate,
    } = withdrawArgs;
    const contract = await Contract.findOneOrFail({ where: { merchantId: merchant.id } });
    if (!contract) {
      throw new HttpException({ status: 404, msg: 'Merchant do not have contract', code: 'SD000034' });
    }
    const contractCurrency = await ContractCurrency.findOne({ where: { currencyId: currency.id } });
    if (!contractCurrency) {
      throw new HttpException({ status: 404, msg: 'Merchant do not have contract', code: 'SD000034' });
    }

    const withdrawEntry = new WithdrawEntry();
    const id = idGenerator();
    withdrawEntry.id = id.toString();
    withdrawEntry.currencyId = currency.id;
    withdrawEntry.rate = rate;
    withdrawEntry.fee = fee;
    withdrawEntry.amount = amount.toString();
    withdrawEntry.cryptoAmount = cryptoAmount;
    withdrawEntry.realCryptoAmount = realCryptoAmount;
    withdrawEntry.merchantId = merchant.id;
    withdrawEntry.txnHash = txnHash;
    withdrawEntry.fromAddress = contract.address;
    withdrawEntry.toAddress = toAddress;
    withdrawEntry.isProcess = true;
    withdrawEntry.createdAt = getIdDate(id, 'YYYYMMDDHHmmss');
    withdrawEntry.cbUrl = cbUrl;
    withdrawEntry.cbId = cbId;
    withdrawEntry.gasPrice = gasPrice;
    await em.save(withdrawEntry, { reload: true });

    return withdrawEntry;
  };

  findWillConfirmEntry = async (criteria: { txnHash: string }): Promise<WithdrawEntry> => {
    const { txnHash } = criteria;
    const em = getManager();
    return await em.createQueryBuilder(WithdrawEntry, 'w')
      .where('w.txnHash = :txnHash', { txnHash })
      .andWhere('w.isProcess = :isProcess', { isProcess: true })
      .getOne();
  };

  confirmEntry = async (em: EntityManager, entry: WithdrawEntry, userId: number): Promise<void> => {
    entry = await em.findOne(WithdrawEntry, entry.id, { lock: { mode: 'pessimistic_write' } });
    entry.isConfirmed = true;
    entry.confirmedAt = dayjs().format('YYYYMMDDHHmmss');
    entry.isProcess = false;
    entry.userId = userId;
    await em.save(entry, { reload: true });
  };

  manualConfirmEntry = async (em: EntityManager, entry: WithdrawEntry, userId: number, txnHash?: string): Promise<WithdrawEntry> => {
    entry = await em.findOne(WithdrawEntry, entry.id, { lock: { mode: 'pessimistic_write' } });
    entry.isConfirmed = true;
    entry.confirmedAt = dayjs().format('YYYYMMDDHHmmss');
    entry.isProcess = false;
    entry.isManual = true;
    entry.userId = userId;

    if (txnHash) {
      entry.txnHash = txnHash;
    }

    return await em.save(entry, { reload: true });
  };

  findOneEntry = async (criteria: IEntryCriteria = {}): Promise<WithdrawEntry> => {
    const entryRepository = getCustomRepository(WithdrawEntryRepository);
    return await entryRepository.findOneBy(criteria);
  };

  findEntry = async (criteria: IEntryCriteria = {}): Promise<WithdrawEntry[]> => {
    const withdrawEntryRepository = getCustomRepository(WithdrawEntryRepository);
    return await withdrawEntryRepository.findBy(criteria);
  };

  findAndCountAll = async (criteria: IEntryCriteria = {}): Promise<{ entries: WithdrawEntry[], count: number }> => {
    const withdrawEntryRepository = getCustomRepository(WithdrawEntryRepository);
    const [entries, count] = await withdrawEntryRepository.findAndCountAll(criteria);
    return {
      entries,
      count,
    };
  };

}

export default WithdrawEntryService;
