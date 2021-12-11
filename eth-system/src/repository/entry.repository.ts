import { EntityRepository, Repository } from 'typeorm';
import { Entry } from '../entity/Entry';
import { setOptions } from './shared';
import { IEntryCriteria } from './types';

@EntityRepository(Entry)
class EntryRepository extends Repository<Entry> {
  findBy = async (criteria: IEntryCriteria): Promise<Array<Entry>> => {
    const opt = setOptions(criteria);
    opt.relations = ['currency'];
    return await this.find(opt);
  };

  findAndCountAll = async (criteria: IEntryCriteria): Promise<[Entry[], number]> => {
    const opt = setOptions(criteria);
    opt.relations = Array.from(new Set(['currency', ...criteria.relations]));
    return await this.findAndCount(opt);
  };

  findOneBy = async (criteria: IEntryCriteria): Promise<Entry> => {
    const opt = setOptions(criteria);
    opt.relations = ['currency', 'user'];
    return await this.findOne(opt);
  };
}

export default EntryRepository;
