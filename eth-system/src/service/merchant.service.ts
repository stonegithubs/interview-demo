import MerchantRepository, { IMerchant } from '../repository/merchant.repository';
import { getCustomRepository } from 'typeorm';
import { Merchant } from '../entity/Merchant';

class MerchantService {
  findOneBy = async (criteria: IMerchant): Promise<Merchant | undefined> => {
    const merchantRepository = getCustomRepository(MerchantRepository);
    return await merchantRepository.findOneBy(criteria);
  };

  edit = async (m: Merchant, criteria: IMerchant): Promise<Merchant> => {
    const merchantRepository = getCustomRepository(MerchantRepository);
    return await merchantRepository.edit(m, criteria);
  };

  findBy = async (criteria: IMerchant, firstResult: number, maxResults: number): Promise<Merchant[]> => {
    const merchantRepository = getCustomRepository(MerchantRepository);
    return await merchantRepository.list(criteria, firstResult, maxResults);
  };

  create = async (body: IMerchant): Promise<Merchant> => {
    const merchantRepository = getCustomRepository(MerchantRepository);
    return await merchantRepository.createMerchant(body);
  };
}

export default MerchantService;
