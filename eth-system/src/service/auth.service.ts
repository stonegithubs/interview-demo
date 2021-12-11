import { getCustomRepository } from 'typeorm';
import RoleRepository from '../repository/role.repository';
import { IRoleHasPrivilege } from '../repository/types';

class AuthService {
  getRolePrivilege = async (roleId: number): Promise<IRoleHasPrivilege> => {
    const roleRepository = getCustomRepository(RoleRepository);
    return await roleRepository.getRolePrivilege(roleId);
  };
}

export default AuthService;
