import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { RolePrivilegeGroup } from './RolePrivilegeGroup';

@Entity('role', { schema: 'eth_system' })
export class Role extends BaseEntity {
  static NORMAL_USER = 1;
  static ADMIN = 2;

  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({
    name: 'name',
    comment: '角色',
  })
  name: string;

  @Column({
    name: 'alias',
    comment: '角色',
  })
  alias: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @OneToMany(
    () => RolePrivilegeGroup,
    (rolePrivilegeGroup) => rolePrivilegeGroup.role,
  )
  rolePrivilegeGroups: RolePrivilegeGroup[];
}
