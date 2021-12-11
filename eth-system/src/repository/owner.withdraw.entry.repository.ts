import { OwnerWithdrawEntry } from '../entity/OwnerWithdrawEntry';
import { EntityRepository, Repository } from 'typeorm';
import { setOptions } from './shared';
import { IEntryCriteria } from './types';

@EntityRepository(OwnerWithdrawEntry)
class OwnerWithdrawEntryRepository extends Repository<OwnerWithdrawEntry> {
  findBy = async (criteria: IEntryCriteria): Promise<Array<OwnerWithdrawEntry>> => {
    const opt = setOptions(criteria);
    opt.relations = ['currency'];
    return await this.find(opt);
  };

  findAndCountAll = async (criteria: IEntryCriteria): Promise<[OwnerWithdrawEntry[], number]> => {
    const opt = setOptions(criteria);
    opt.relations = Array.from(new Set(['currency', ...criteria.relations]));
    return await this.findAndCount(opt);
  };

  findOneBy = async (criteria: IEntryCriteria): Promise<OwnerWithdrawEntry> => {
    const opt = setOptions(criteria);
    opt.relations = ['currency', 'user'];
    return await this.findOne(opt);
  };
}

export default OwnerWithdrawEntryRepository;
