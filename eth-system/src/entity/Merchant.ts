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
import { Contract } from './Contract';
import { User } from './User';
import { WithdrawEntry } from './WithdrawEntry';
import { v4 as uuid } from 'uuid';
import { randStr } from '../lib/utils';
import { Entry } from './Entry';
import { OwnerWithdrawEntry } from './OwnerWithdrawEntry';

@Index('merchant_number_uindex', ['number'], { unique: true })
@Index('merchant_user_id_fk', ['userId'], {})
@Entity('merchant', { schema: 'eth_system' })
export class Merchant extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', {
    name: 'number',
    nullable: true,
    unique: true,
    comment: '商戶號',
    length: 255,
  })
  number: string | null;

  @Column('varchar', { name: 'private_key', comment: '商戶密錀', length: 255, select: false })
  privateKey: string;

  @Column('int', { name: 'user_id', comment: '擁有使用者id' })
  userId: number;

  @Column('decimal', {
    name: 'min_per_deposit',
    nullable: true,
    comment: '最小入款金額',
    precision: 27,
    scale: 9,
    default: () => '0.000000000',
  })
  minPerDeposit: string | null;

  @Column('decimal', {
    name: 'max_per_deposit',
    nullable: true,
    comment: '最大入款金額',
    precision: 27,
    scale: 9,
    default: () => '0.000000000',
  })
  maxPerDeposit: string | null;

  @Column('decimal', {
    name: 'min_per_withdraw',
    nullable: true,
    comment: '最小出款金額',
    precision: 27,
    scale: 9,
    default: () => '0.000000000',
  })
  minPerWithdraw: string | null;

  @Column('decimal', {
    name: 'max_per_withdraw',
    nullable: true,
    comment: '最大出款金額',
    precision: 27,
    scale: 9,
    default: () => '0.000000000',
  })
  maxPerWithdraw: string | null;

  @Column('float', {
    name: 'fee_percent',
    comment: '收取的手續費百分比',
    precision: 12,
    default: () => '0',
  })
  feePercent: number;

  @Column('float', {
    name: 'withdraw_fee_percent',
    comment: '出款收取的手續費百分比',
    precision: 12,
    default: () => '0',
  })
  withdrawFeePercent: number;

  constructor(m?: { userId: number }) {
    super();
    Object.assign(this, m);
  }

  @BeforeInsert()
  createUuid(): void {
    this.number = uuid();
  }

  @BeforeInsert()
  createPrivateKey(): void {
    this.privateKey = randStr({ length: 36 });
  }

  @OneToMany(() => Contract, (contract) => contract.merchant)
  contracts: Contract[];

  @OneToMany(
    () => OwnerWithdrawEntry,
    (ownerWithdrawEntry) => ownerWithdrawEntry.merchant,
  )
  ownerWithdrawEntries: OwnerWithdrawEntry[];

  @ManyToOne(() => User, (user) => user.merchants, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(() => WithdrawEntry, (withdrawEntry) => withdrawEntry.merchant)
  withdrawEntries: WithdrawEntry[];

  @OneToMany(() => Entry, (entry) => entry.merchant)
  entries: Entry[];
}
