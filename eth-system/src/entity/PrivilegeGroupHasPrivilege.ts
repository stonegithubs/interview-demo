import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { PrivilegeGroup } from './PrivilegeGroup';
import { Privilege } from './Privilege';

@Index(
  'privilege_group_has_privilege_privilege_group_id_fk',
  ['privilegeGroupId'],
  {},
)
@Index('privilege_group_has_privilege_privilege_id_fk', ['privilegeId'], {})
@Entity('privilege_group_has_privilege', { schema: 'eth_system' })
export class PrivilegeGroupHasPrivilege extends BaseEntity {
  @PrimaryColumn('int', {
    name: 'privilege_group_id',
    comment: '權限群組id',
  })
  privilegeGroupId: number | null;

  @Column('int', { name: 'privilege_id', nullable: true, comment: '權限id' })
  privilegeId: number | null;

  @ManyToOne(
    () => PrivilegeGroup,
    (privilegeGroup) => privilegeGroup.privilegeGroupHasPrivileges,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'privilege_group_id', referencedColumnName: 'id' }])
  privilegeGroup: PrivilegeGroup;

  @ManyToOne(
    () => Privilege,
    (privilege) => privilege.privilegeGroupHasPrivileges,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'privilege_id', referencedColumnName: 'id' }])
  privilege: Privilege;
}
