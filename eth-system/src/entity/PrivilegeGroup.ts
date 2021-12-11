import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PrivilegeGroupHasPrivilege } from './PrivilegeGroupHasPrivilege';
import { RolePrivilegeGroup } from './RolePrivilegeGroup';

@Entity('privilege_group', { schema: 'eth_system' })
export class PrivilegeGroup extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', {
    name: 'name',
    nullable: true,
    comment: '權限群組名稱',
    length: 255,
  })
  name: string | null;

  @OneToMany(
    () => PrivilegeGroupHasPrivilege,
    (privilegeGroupHasPrivilege) => privilegeGroupHasPrivilege.privilegeGroup,
  )
  privilegeGroupHasPrivileges: PrivilegeGroupHasPrivilege[];

  @OneToMany(
    () => RolePrivilegeGroup,
    (rolePrivilegeGroup) => rolePrivilegeGroup.privilegeGroup,
  )
  rolePrivilegeGroups: RolePrivilegeGroup[];
}
