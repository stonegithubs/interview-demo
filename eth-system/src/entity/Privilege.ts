import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PrivilegeGroupHasPrivilege } from './PrivilegeGroupHasPrivilege';

@Entity('privilege', { schema: 'eth_system' })
export class Privilege extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', comment: '權限名稱', length: 255 })
  name: string;

  @OneToMany(
    () => PrivilegeGroupHasPrivilege,
    (privilegeGroupHasPrivilege) => privilegeGroupHasPrivilege.privilege,
  )
  privilegeGroupHasPrivileges: PrivilegeGroupHasPrivilege[];
}
