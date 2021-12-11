import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { Merchant } from '../entity/Merchant';

export interface IMerchant {
  id?: number;
  number?: string;
  privateKey?: string,
  userId?: number | string;
  minPerDeposit?: string;
  maxPerDeposit?: string;
  minPerWithdraw?: string;
  maxPerWithdraw?: string;
  feePercent?: number | string;
  withdrawFeePercent?: number | string;
}

@EntityRepository(Merchant)
class MerchantRepository extends Repository<Merchant> {
  findOneBy = async (criteria: IMerchant): Promise<Merchant | undefined> => {
    const qb = this.createQueryBuilder('m');
    this.setCriteria(qb, criteria);
    return await qb.getOne();
  };

  setCriteria = (qb: SelectQueryBuilder<Merchant>, criteria: IMerchant): void => {
    for (const [key, value] of Object.entries(criteria)) {
      if (value) {
        qb.andWhere(`m.${key} = :${key}`, { [key]: value });
      }
    }
  };

  edit = async (m: Merchant, criteria: IMerchant): Promise<Merchant> => {
    if (criteria.feePercent) {
      m.feePercent = criteria.feePercent as number;
    }
    if (criteria.withdrawFeePercent) {
      m.withdrawFeePercent = criteria.withdrawFeePercent as number;
    }
    return await this.manager.transaction(async (em) => {
      return await em.save(m, { reload: true });
    });
  };

  list = async (criteria: IMerchant, firstResult: number, maxResults: number): Promise<Merchant[]> => {
    const qb = this.createQueryBuilder('m');
    this.setCriteria(qb, criteria);
    qb.skip(firstResult)
      .limit(maxResults);
    return await qb.getMany();
  };

  createMerchant = async (body: IMerchant): Promise<Merchant> => {
    const {
      userId,
      minPerDeposit,
      maxPerDeposit,
      minPerWithdraw,
      maxPerWithdraw,
      feePercent,
      withdrawFeePercent,
    } = body;
    const m = new Merchant({ userId: userId as number });
    m.minPerDeposit = minPerDeposit;
    m.maxPerDeposit = maxPerDeposit;
    m.minPerWithdraw = minPerWithdraw;
    m.maxPerWithdraw = maxPerWithdraw;
    m.feePercent = feePercent as number;
    m.withdrawFeePercent = withdrawFeePercent as number;
    await m.save({ reload: true });
    delete m.privateKey;
    return m;
  };
}

export default MerchantRepository;
