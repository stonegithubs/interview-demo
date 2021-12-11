import { EntityManager } from 'typeorm';
import { Entry } from '../entity/Entry';
import { ContractCurrency } from '../entity/ContractCurrency';
import { WithdrawEntry } from '../entity/WithdrawEntry';
import { OwnerWithdrawEntry } from '../entity/OwnerWithdrawEntry';

class ContractCurrencyService {
  // 客人入款成功confirm 把錢加到錢包
  increaseWithEntryConfirm = async (em: EntityManager, contractAddress: string, entry: Entry): Promise<void> => {
    const contractCurrency = await em.createQueryBuilder(ContractCurrency, 'c')
      .setLock('pessimistic_write')
      .where('c.contractAddress = :contractAddress', { contractAddress })
      .getOne();

    contractCurrency.increaseBalance(entry.realCryptoAmount);
    contractCurrency.increaseFee(entry.fee);
    await em.save(contractCurrency);
  };

  decreaseWithWithdraw = async (em: EntityManager, withdrawEntry: WithdrawEntry): Promise<void> => {
    const contractCurrency = await em.createQueryBuilder(ContractCurrency, 'c')
      .setLock('pessimistic_write')
      .where('c.contractAddress = :contractAddress', { contractAddress: withdrawEntry.fromAddress })
      .getOne();

    contractCurrency.decreaseBalance(withdrawEntry.cryptoAmount);
    contractCurrency.increaseFee(withdrawEntry.fee);
    await em.save(contractCurrency);
  };

  decreaseWithOwnerWithdraw = async (em: EntityManager, ownerWithdrawEntry: OwnerWithdrawEntry): Promise<void> => {
    const contractCurrency = await em.createQueryBuilder(ContractCurrency, 'c')
      .setLock('pessimistic_write')
      .where('c.contractAddress = :contractAddress', { contractAddress: ownerWithdrawEntry.fromAddress })
      .getOne();

    contractCurrency.decreaseBalance(ownerWithdrawEntry.cryptoAmount);
    contractCurrency.increaseFee(ownerWithdrawEntry.fee);
    await em.save(contractCurrency);
  };

  /**
   * 取得ContractCurrency
   * @returns {Promise<ContractCurrency>}
   */
  getContractCurrency = async (): Promise<ContractCurrency> => {
    return await ContractCurrency.findOne({ relations: ['currency'] });
  };
}

export default ContractCurrencyService;
