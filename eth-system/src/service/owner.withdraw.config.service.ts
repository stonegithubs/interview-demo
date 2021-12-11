import { getCustomRepository } from 'typeorm';
import { OwnerWithdrawConfig } from '../entity/OwnerWithdrawConfig';
import OwnerWithdrawConfigRepository, { IOwnerWithdrawConfigCriteria } from '../repository/owner.withdraw.config.repository';
import numeral from 'numeral';

class OwnerWithdrawConfigService {
  insert = async (data: IOwnerWithdrawConfigCriteria): Promise<OwnerWithdrawConfig> => {
    const ownerWithdrawConfigRepository = getCustomRepository(OwnerWithdrawConfigRepository);
    return await ownerWithdrawConfigRepository.createAndSave(data);
  };

  edit = async (owc: OwnerWithdrawConfig, data: IOwnerWithdrawConfigCriteria): Promise<OwnerWithdrawConfig> => {
    const ownerWithdrawConfigRepository = getCustomRepository(OwnerWithdrawConfigRepository);
    return await ownerWithdrawConfigRepository.edit(owc, data);
  };

  getOne = async (currencyId?: number): Promise<OwnerWithdrawConfig> => {
    if (!currencyId) {
      currencyId = 2;
    }
    const ownerWithdrawConfigRepository = getCustomRepository(OwnerWithdrawConfigRepository);
    return await ownerWithdrawConfigRepository.getOne(currencyId);
  };

  getFee = (owc: OwnerWithdrawConfig, cryptoAmount: number | string): number => {
    if (owc.isEnableFeePercent) {
      return numeral(owc.feePercent).multiply(cryptoAmount).divide(100).value();
    }
    return numeral(owc.feeAmount).value();
  };
}

export default OwnerWithdrawConfigService;
