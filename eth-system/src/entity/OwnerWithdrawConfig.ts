import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import dayjs from 'dayjs';
import { Currency } from './Currency';

@Index('owner_withdraw_config_user_id_fk', ['userId'], {})
@Entity('owner_withdraw_config', { schema: 'eth_system' })
export class OwnerWithdrawConfig extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'user_id', comment: '操作者id' })
  userId: number;

  @Column('tinyint', {
    name: 'is_enable_fee_percent',
    comment: '是否啟用提現手續費%',
    width: 1,
    default: () => '0',
    transformer: {
      to: (value: string) => value,
      from: (value: string) => {
        return !!value;
      },
    },
  })
  isEnableFeePercent: boolean;

  @Column('tinyint', {
    name: 'is_enable_fee_amount',
    comment: '是否啟用提現手續費固定金額',
    width: 1,
    default: () => '0',
    transformer: {
      to: (value: string) => value,
      from: (value: string) => {
        return !!value;
      },
    },
  })
  isEnableFeeAmount: boolean;

  @Column('float', {
    name: 'fee_percent',
    comment: '手續費%',
    precision: 12,
    default: () => '0',
  })
  feePercent: number;

  @Column('decimal', {
    name: 'fee_amount',
    comment: '手續費固定金額',
    precision: 27,
    scale: 9,
    default: () => '0.000000000',
  })
  feeAmount: string;

  @Column('bigint', {
    name: 'created_at',
    comment: '建立日期',
    unsigned: true,
    transformer: {
      to: (value: string) => value,
      from: (value: string) => {
        if (!value) return value;
        return dayjs(value, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss');
      },
    },
  })
  createdAt: string;

  @Column('bigint', {
    name: 'modified_at',
    comment: '修改日期',
    unsigned: true,
    transformer: {
      to: (value: string) => value,
      from: (value: string) => {
        if (!value) return value;
        return dayjs(value, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss');
      },
    },
  })
  modifiedAt: string;

  @Column('int', { name: 'currency_id' })
  currencyId: number;

  @ManyToOne(() => User, user => user.ownerWithdrawConfigs, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => Currency, (currency) => currency.ownerWithdrawConfigs, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'currency_id', referencedColumnName: 'id' }])
  currency: Currency;

  updateCreatedAt(): void {
    this.createdAt = dayjs().format('YYYYMMDDHHmmss');
  }

  updateModifiedAt(): void {
    this.modifiedAt = dayjs().format('YYYYMMDDHHmmss');
  }
}
