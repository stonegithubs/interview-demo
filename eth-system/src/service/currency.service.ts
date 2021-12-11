import { getRepository } from 'typeorm';
import { Currency } from '../entity/Currency';
import { DAY } from '../lib/constant';

class CurrencyService {
  getCurrency = async (currencyId: number): Promise<Currency> => {
    const currencyRepository = getRepository(Currency);
    return await currencyRepository.findOne(currencyId, { cache: DAY });
  };
}

export default CurrencyService;
