import { EntityRepository, Repository } from 'typeorm';
import { Role } from '../entity/Role';
import { PrivilegeGroupHasPrivilege } from '../entity/PrivilegeGroupHasPrivilege';
import { Privilege } from '../entity/Privilege';
import { HOUR } from '../lib/constant';
import { IRoleHasPrivilege } from './types';

@EntityRepository(Role)
class RoleRepository extends Repository<Role> {
  /**
   * 取得角色權限
   * @description 預設cache 4小時
   * @param {number} roleId
   * @returns {Promise<Role>}
   */
  getRolePrivilege = async (roleId: number): Promise<IRoleHasPrivilege> => {
    return await this.createQueryBuilder('r')
      .leftJoin('r.rolePrivilegeGroups', 'rpg')
      .leftJoin('rpg.privilegeGroup', 'pg')
      .leftJoin(PrivilegeGroupHasPrivilege, 'pghp', 'pghp.privilegeGroupId = pg.id')
      .leftJoinAndMapMany('r.privilege', Privilege, 'p', 'pghp.privilegeId = p.id')
      .where('r.id = :roleId', { roleId })
      .cache(HOUR * 4)
      .getOne() as IRoleHasPrivilege;
  };
}

export default RoleRepository;
