import { Rate } from '../entity/Rate';
import RateRepository from '../repository/rate.repository';
import { getCustomRepository } from 'typeorm';

class RateService {
  insert = async (currency: string, vsCurrency: string, rate: string): Promise<void> => {
    const rateRepository = getCustomRepository(RateRepository);
    await rateRepository.createAndSave(currency, vsCurrency, rate);
  };

  getLatestOne = async (vsCurrency: string = 'USDT(ERC20)'): Promise<Rate> => {
    const rateRepository = getCustomRepository(RateRepository);
    return await rateRepository.getLatestOne(vsCurrency);
  };

  deleteBefore = async (date: string) => {
    const rateRepository = getCustomRepository(RateRepository);
    return await rateRepository.deleteFrom(date);
  };

}

export default RateService;
