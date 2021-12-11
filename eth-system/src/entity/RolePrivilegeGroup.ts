import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { PrivilegeGroup } from './PrivilegeGroup';
import { Role } from './Role';

@Index('role_privilege_group_privilege_group_id_fk', ['privilegeGroupId'], {})
@Index('role_privilege_group_role_id_fk', ['roleId'], {})
@Entity('role_privilege_group', { schema: 'eth_system' })
export class RolePrivilegeGroup extends BaseEntity {
  @PrimaryColumn('int', { name: 'role_id', comment: '角色id' })
  roleId: number | null;

  @Column('int', { name: 'privilege_group_id', comment: '權限群組id' })
  privilegeGroupId: number;

  @ManyToOne(
    () => PrivilegeGroup,
    (privilegeGroup) => privilegeGroup.rolePrivilegeGroups,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'privilege_group_id', referencedColumnName: 'id' }])
  privilegeGroup: PrivilegeGroup;

  @ManyToOne(() => Role, (role) => role.rolePrivilegeGroups, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  role: Role;
}
