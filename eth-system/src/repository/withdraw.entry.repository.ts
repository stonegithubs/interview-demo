import { EntityRepository, Repository } from 'typeorm';
import { setOptions } from './shared';
import { IEntryCriteria } from './types';
import { WithdrawEntry } from '../entity/WithdrawEntry';

@EntityRepository(WithdrawEntry)
class WithdrawEntryRepository extends Repository<WithdrawEntry> {
  findBy = async (criteria: IEntryCriteria): Promise<Array<WithdrawEntry>> => {
    const opt = setOptions(criteria);
    return await this.find(opt);
  };

  findAndCountAll = async (criteria: IEntryCriteria): Promise<[WithdrawEntry[], number]> => {
    const opt = setOptions(criteria);
    opt.relations = Array.from(new Set(['currency', ...criteria.relations]));
    return await this.findAndCount(opt);
  };

  findOneBy = async (criteria: IEntryCriteria): Promise<WithdrawEntry> => {
    const opt = setOptions(criteria);
    opt.relations = ['currency', 'user'];
    return await this.findOne(opt);
  };
}

export default WithdrawEntryRepository;
