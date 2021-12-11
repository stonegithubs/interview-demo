import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Merchant } from './Merchant';
import { Role } from './Role';
import bcrypt from 'bcrypt';
import { validOTP } from '../lib/otp';
import { OwnerWithdrawEntry } from './OwnerWithdrawEntry';
import { Entry } from './Entry';
import { WithdrawEntry } from './WithdrawEntry';
import { OwnerWithdrawConfig } from './OwnerWithdrawConfig';

@Index('role_id', ['roleId'], {})
@Index('user_username_uindex', ['username'], { unique: true })
@Entity('user', { schema: 'eth_system' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', {
    name: 'username',
    unique: true,
    comment: '後台登入帳號',
    length: 255,
  })
  username: string;

  @Column('varchar', { name: 'password', comment: '後台登入密碼', length: 255, select: false })
  password: string;

  @Column('int', { name: 'role_id' })
  roleId: number;

  @Column('varchar', {
    name: 'otp_secret',
    unique: true,
    comment: 'OTP secret',
    length: 255,
    select: false,
  })
  otpSecret: string;

  @OneToMany(() => Merchant, (merchant) => merchant.user)
  merchants: Merchant[];

  @OneToMany(() => Entry, (entry) => entry.user)
  entries: Entry[];

  @OneToMany(() => WithdrawEntry, (WithdrawEntry) => WithdrawEntry.user)
  withdrawEntries: WithdrawEntry[];

  @OneToMany(
    () => OwnerWithdrawEntry,
    (ownerWithdrawEntry) => ownerWithdrawEntry.user,
  )
  ownerWithdrawEntries: OwnerWithdrawEntry[];

  @OneToMany(() => OwnerWithdrawConfig, ownerWithdrawConfig => ownerWithdrawConfig.user)
  ownerWithdrawConfigs: OwnerWithdrawConfig[];

  @ManyToOne(() => Role, (role) => role.users, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'role_id', referencedColumnName: 'id' }])
  role: Role;

  constructor(u?: { username: string, password: string, roleId: number, otpSecret?: string }) {
    super();
    Object.assign(this, u);
  }

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }

  /**
   * 比較密碼是否正確
   * @param {string} passwd 使用者傳入的密碼
   * @param {string} hashPassword db存在的密碼
   * @returns bool
   */
  static async isPasswordMatch(passwd: string, hashPassword: string): Promise<boolean> {
    return await bcrypt.compare(passwd, hashPassword);
  }

  /**
   * 比較OTP是否正確
   * @param {string} otp otp六碼
   * @param {string} secret otp secret
   * @returns bool
   */
  static isOTPMatch(otp: string, secret: string): boolean {
    return validOTP(otp, secret);
  }
}
