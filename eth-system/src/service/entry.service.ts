import { Merchant } from '../entity/Merchant';
import { EntityManager, getCustomRepository, getManager } from 'typeorm';
import { Contract } from '../entity/Contract';
import HttpException from '../exception/http.exception';
import { Currency } from '../entity/Currency';
import { Entry } from '../entity/Entry';
import { getIdDate, idGenerator } from '../lib/utils';
import dayjs from 'dayjs';
import EntryRepository from '../repository/entry.repository';
import { IEntryCriteria } from '../repository/types';
import RateRepository from '../repository/rate.repository';
import numeral from 'numeral';
import ContractCurrencyService from './contract.currency.service';

interface IDepositArgs {
  merchant: Merchant,
  currency: Currency,
  amount: number,
  cbUrl: string,
  cbId: string,
}

// TODO repository 改成di可能不用一直宣告？
class EntryService {
  deposit = async ({
    merchant,
    currency,
    amount,
    cbUrl,
    cbId,
  }: IDepositArgs): Promise<Entry> => {
    const em = getManager();
    const rateRepository = getCustomRepository(RateRepository);
    const contract = await Contract.findOneOrFail({ where: { merchantId: merchant.id } });
    if (!contract) {
      throw new HttpException({ status: 404, msg: 'Merchant do not have contract', code: 'SD000021' });
    }

    const rate = await rateRepository.getLatestOne(currency.name);
    const randomAmount = parseFloat((Math.random() / 10).toFixed(6));
    const cryptoAmount = (amount * parseFloat(rate.rate) + randomAmount).toFixed(6);
    const fee = numeral(cryptoAmount).multiply(merchant.feePercent / 100.0).format('0.000000');
    const realCryptoAmount = numeral(cryptoAmount).subtract(numeral(fee).value()).format('0.000000');
    const entry = new Entry();
    const id = idGenerator();
    entry.id = id.toString();
    entry.currencyId = currency.id;
    entry.rate = rate.rate;
    entry.fee = fee;
    entry.amount = amount.toString();
    entry.cryptoAmount = cryptoAmount;
    entry.realCryptoAmount = realCryptoAmount;
    entry.randomAmount = randomAmount.toFixed(6);
    entry.merchantId = merchant.id;
    entry.toAddress = contract.address;
    entry.isProcess = true;
    entry.createdAt = getIdDate(id, 'YYYYMMDDHHmmss');
    entry.cbUrl = cbUrl;
    entry.cbId = cbId;

    await em.transaction(async (scopeEm: EntityManager) => {
      await scopeEm.insert(Entry, entry);
    });

    return entry;
  };

  // 需搭配transaction裡面的em
  confirmEntry = async (em: EntityManager, entry: Entry, data: { txnHash: string, fromAddress: string, userId: number, isManual?: boolean }): Promise<Entry> => {
    entry = await em.findOne(Entry, entry.id, { lock: { mode: 'pessimistic_write' } });
    entry.isConfirmed = true;
    entry.confirmedAt = dayjs().format('YYYYMMDDHHmmss');
    entry.isProcess = false;
    entry.txnHash = data.txnHash;
    entry.fromAddress = data.fromAddress;
    entry.userId = data.userId;
    if (data.isManual) {
      entry.isManual = true;
    }
    return await em.save(entry, { reload: true });
  };

  findEntry = async (criteria: IEntryCriteria = {}): Promise<Entry[]> => {
    const entryRepository = getCustomRepository(EntryRepository);
    return await entryRepository.findBy(criteria);
  };

  findAndCountAll = async (criteria: IEntryCriteria = {}): Promise<{ entries: Entry[], count: number }> => {
    const entryRepository = getCustomRepository(EntryRepository);
    const [entries, count] = await entryRepository.findAndCountAll(criteria);
    return {
      entries,
      count,
    };
  };

  findOneEntry = async (criteria: IEntryCriteria = {}): Promise<Entry> => {
    const entryRepository = getCustomRepository(EntryRepository);
    return await entryRepository.findOneBy(criteria);
  };

  findWillConfirmEntry = async (criteria: { cryptoAmount: string; toAddress: string }): Promise<Entry> => {
    const { cryptoAmount, toAddress } = criteria;
    const before2Hour = dayjs().add(-2, 'h').format('YYYYMMDDHHmmss');
    const em = getManager();
    return await em.createQueryBuilder(Entry, 'entry')
      .where('entry.cryptoAmount = :cryptoAmount', { cryptoAmount })
      .andWhere('entry.createdAt >=:createdAt', { createdAt: before2Hour })
      .andWhere('entry.isProcess = :isProcess', { isProcess: true })
      .andWhere('entry.toAddress = :toAddress', { toAddress })
      .getOne();
  };

  manualConfirmEntry = async ({
    txnHash,
    entry,
    fromAddress,
    userId,
  }: { txnHash: string; entry: Entry; fromAddress: string, userId: number }): Promise<Entry> => {
    const entityManager = getManager();
    return await entityManager.transaction(async (em) => {
      entry = await this.confirmEntry(em, entry, { txnHash, fromAddress, userId, isManual: true });

      // 加錢到錢包
      const contractCurrencyService = new ContractCurrencyService();
      await contractCurrencyService.increaseWithEntryConfirm(
        em,
        entry.toAddress,
        entry,
      );
      return entry;
    });
  };
}

export default EntryService;
