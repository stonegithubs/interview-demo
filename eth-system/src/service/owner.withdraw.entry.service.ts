import { EntityManager, getCustomRepository, getManager } from 'typeorm';
import { IEntryCriteria } from '../repository/types';
import OwnerWithdrawEntryRepository from '../repository/owner.withdraw.entry.repository';
import { OwnerWithdrawEntry } from '../entity/OwnerWithdrawEntry';
import { Contract } from '../entity/Contract';
import { Merchant } from '../entity/Merchant';
import { Currency } from '../entity/Currency';
import dayjs from 'dayjs';

interface IOwnerWithdrawEntryArgs {
  merchant: Merchant,
  currency: Currency,
  toAddress: string,
  txnHash: string;
  gasPrice: number;
  cryptoAmount: string;
  realCryptoAmount: string;
  fee: string;
}

class OwnerWithdrawEntryService {
  ownerWithdraw = async (em: EntityManager, ownerWithdrawArgs: IOwnerWithdrawEntryArgs): Promise<OwnerWithdrawEntry> => {
    const {
      merchant,
      toAddress,
      currency,
      txnHash,
      gasPrice,
      cryptoAmount,
      realCryptoAmount,
      fee,
    } = ownerWithdrawArgs;

    const contract = await Contract.findOneOrFail({ where: { merchantId: merchant.id } });
    const ownerWithdrawEntry = new OwnerWithdrawEntry();
    ownerWithdrawEntry.currencyId = currency.id;
    ownerWithdrawEntry.fee = fee;
    ownerWithdrawEntry.cryptoAmount = cryptoAmount;
    ownerWithdrawEntry.realCryptoAmount = realCryptoAmount;
    ownerWithdrawEntry.merchantId = merchant.id;
    ownerWithdrawEntry.txnHash = txnHash;
    ownerWithdrawEntry.fromAddress = contract.address;
    ownerWithdrawEntry.toAddress = toAddress;
    ownerWithdrawEntry.isProcess = true;
    ownerWithdrawEntry.createdAt = dayjs().format('YYYYMMDDHHmmss');
    ownerWithdrawEntry.gasPrice = gasPrice;
    await em.save(ownerWithdrawEntry, { reload: true });

    return ownerWithdrawEntry;
  };

  findWillConfirmEntry = async (criteria: { txnHash: string }): Promise<OwnerWithdrawEntry> => {
    const { txnHash } = criteria;
    const em = getManager();
    return await em.createQueryBuilder(OwnerWithdrawEntry, 'w')
      .where('w.txnHash = :txnHash', { txnHash })
      .andWhere('w.isProcess = :isProcess', { isProcess: true })
      .getOne();
  };

  confirmEntry = async (em: EntityManager, entry: OwnerWithdrawEntry): Promise<void> => {
    entry = await em.findOne(OwnerWithdrawEntry, entry.id, { lock: { mode: 'pessimistic_write' } });
    entry.isConfirmed = true;
    entry.confirmedAt = dayjs().format('YYYYMMDDHHmmss');
    entry.isProcess = false;
    entry.complete();
    await em.save(entry, { reload: true });
  };

  findOneEntry = async (criteria: IEntryCriteria = {}): Promise<OwnerWithdrawEntry> => {
    const ownerWithdrawEntryRepository = getCustomRepository(OwnerWithdrawEntryRepository);
    return await ownerWithdrawEntryRepository.findOneBy(criteria);
  };

  findEntry = async (criteria: IEntryCriteria = {}): Promise<OwnerWithdrawEntry[]> => {
    const ownerWithdrawEntryRepository = getCustomRepository(OwnerWithdrawEntryRepository);
    return await ownerWithdrawEntryRepository.findBy(criteria);
  };

  findAndCountAll = async (criteria: IEntryCriteria = {}): Promise<{ entries: OwnerWithdrawEntry[], count: number }> => {
    const ownerWithdrawEntryRepository = getCustomRepository(OwnerWithdrawEntryRepository);
    const [entries, count] = await ownerWithdrawEntryRepository.findAndCountAll(criteria);
    return {
      entries,
      count,
    };
  };

  manualConfirmEntry = async (em: EntityManager, entry: OwnerWithdrawEntry, userId: number, txnHash?: string): Promise<OwnerWithdrawEntry> => {
    entry = await em.findOne(OwnerWithdrawEntry, entry.id, { lock: { mode: 'pessimistic_write' } });
    entry.isConfirmed = true;
    entry.confirmedAt = dayjs().format('YYYYMMDDHHmmss');
    entry.isProcess = false;
    entry.isManual = true;
    entry.complete();
    entry.userId = userId;

    // 如果有帶hash 就取代原有的hash
    if (txnHash) {
      entry.txnHash = txnHash;
    }

    return await em.save(entry, { reload: true });
  };
}

export default OwnerWithdrawEntryService;
