import { EntityRepository, Repository } from 'typeorm';
import { Rate } from '../entity/Rate';
import dayjs from 'dayjs';

@EntityRepository(Rate)
class RateRepository extends Repository<Rate> {
  createAndSave = async (currency: string, vsCurrency: string, rate: string): Promise<void> => {
    const rateEntity = new Rate();
    rateEntity.currency = currency;
    rateEntity.vsCurrency = vsCurrency;
    rateEntity.createdAt = dayjs().format('YYYYMMDDHHmmss');
    rateEntity.rate = rate;
    await this.manager.save(rateEntity);
  };

  getLatestOne = async (vsCurrency: string = 'USDT(ERC20)'): Promise<Rate> => {
    return await this.findOne({ where: { vsCurrency }, order: { createdAt: 'DESC' } });
  };

  deleteFrom = async (date: string): Promise<void> => {
    await this.createQueryBuilder('rate')
      .delete()
      .where('createdAt <= :createdAt', { createdAt: date })
      .execute();
  };

}

export default RateRepository;
