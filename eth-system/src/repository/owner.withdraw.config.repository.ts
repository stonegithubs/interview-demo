import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { OwnerWithdrawConfig } from '../entity/OwnerWithdrawConfig';

export interface IOwnerWithdrawConfigCriteria {
  id?: number;
  userId?: number;
  isEnableFeePercent?: boolean;
  isEnableFeeAmount?: boolean;
  feePercent?: number;
  feeAmount?: string;
}

@EntityRepository(OwnerWithdrawConfig)
class OwnerWithdrawConfigRepository extends Repository<OwnerWithdrawConfig> {
  createAndSave = async (data: IOwnerWithdrawConfigCriteria): Promise<OwnerWithdrawConfig> => {
    const { userId, isEnableFeeAmount = false, isEnableFeePercent = false, feePercent = 0, feeAmount = '0.0' } = data;
    const owc = new OwnerWithdrawConfig();
    owc.userId = userId;
    owc.isEnableFeeAmount = isEnableFeeAmount;
    owc.isEnableFeePercent = isEnableFeePercent;
    owc.feeAmount = feeAmount;
    owc.feePercent = feePercent;
    owc.updateCreatedAt();
    return await this.manager.save(owc, { reload: true });
  };

  getOne = async (currencyId: number): Promise<OwnerWithdrawConfig> => {
    return await this.findOne({ where: { currencyId } });
  };

  edit = async (owc: OwnerWithdrawConfig, data: IOwnerWithdrawConfigCriteria): Promise<OwnerWithdrawConfig> => {
    owc.updateModifiedAt();
    owc.userId = data.userId;
    owc.feePercent = data.feePercent;
    owc.feeAmount = data.feeAmount;
    owc.isEnableFeeAmount = data.isEnableFeeAmount;
    owc.isEnableFeePercent = data.isEnableFeePercent;
    return await this.manager.save(owc, { reload: true });
  };

  setCriteria = (qb: SelectQueryBuilder<OwnerWithdrawConfig>, criteria: IOwnerWithdrawConfigCriteria): void => {
    for (const [key, value] of Object.entries(criteria)) {
      if (value) {
        qb.andWhere(`m.${key} = :${key}`, { [key]: value });
      }
    }
  };

}

export default OwnerWithdrawConfigRepository;
