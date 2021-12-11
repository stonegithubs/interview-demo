import { BaseEntity, Column } from 'typeorm';
import dayjs from 'dayjs';

export class EntryBase extends BaseEntity {
  @Column('int', { name: 'currency_id', comment: '幣別id' })
  currencyId: number;

  @Column('int', { name: 'merchant_id', comment: '商號id' })
  merchantId: number;

  @Column('decimal', {
    name: 'fee',
    comment: '手續費',
    precision: 27,
    scale: 9,
  })
  fee: string;

  @Column('decimal', {
    name: 'crypto_amount',
    comment: '加密貨幣數量',
    precision: 27,
    scale: 9,
  })
  cryptoAmount: string;

  @Column('decimal', {
    name: 'real_crypto_amount',
    nullable: true,
    comment: '實際加密貨幣數量(扣完fee)',
    precision: 27,
    scale: 9,
  })
  realCryptoAmount: string | null;

  @Column('varchar', {
    name: 'from_address',
    comment: '從哪個地址打來',
    length: 255,
  })
  fromAddress: string;

  @Column('varchar', {
    name: 'to_address',
    comment: '打到哪個地址',
    length: 255,
  })
  toAddress: string;

  @Column('varchar', { name: 'txn_hash', comment: '交易hash', length: 255 })
  txnHash: string | null;

  @Column('tinyint', {
    name: 'is_process',
    comment: '是否處理中',
    width: 1,
    default: () => '0',
    transformer: {
      to: (value: boolean) => value,
      from: (value: boolean) => {
        return !!value;
      },
    },
  })
  isProcess: boolean;

  @Column('tinyint', {
    name: 'is_failed',
    comment: '是否交易失敗',
    width: 1,
    default: () => '0',
    transformer: {
      to: (value: boolean) => value,
      from: (value: boolean) => {
        return !!value;
      },
    },
  })
  isFailed: boolean;

  @Column('tinyint', {
    name: 'is_confirmed',
    comment: '是否確認',
    width: 1,
    default: () => '0',
    transformer: {
      to: (value: boolean) => value,
      from: (value: boolean) => {
        return !!value;
      },
    },
  })
  isConfirmed: boolean;

  @Column('tinyint', {
    name: 'is_completed',
    comment: '是否完成',
    width: 1,
    default: () => '0',
    transformer: {
      to: (value: boolean) => value,
      from: (value: boolean) => {
        return !!value;
      },
    },
  })
  isCompleted: boolean;

  @Column('tinyint', {
    name: 'is_manual',
    comment: '是否手動認款',
    width: 1,
    default: () => '0',
    transformer: {
      to: (value: boolean) => value,
      from: (value: boolean) => {
        return !!value;
      },
    },
  })
  isManual: boolean;

  @Column('int', { name: 'user_id', nullable: true, comment: '操作者id' })
  userId: number | null;

  @Column('bigint', {
    name: 'created_at',
    comment: '建立訂單日期',
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
    name: 'confirmed_at',
    nullable: true,
    comment: '訂單確認時間',
    unsigned: true,
    transformer: {
      to: (value: string) => value,
      from: (value: string) => {
        if (!value) return value;
        return dayjs(value, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss');
      },
    },
  })
  confirmedAt: string | null;

  @Column('bigint', {
    name: 'completed_at',
    nullable: true,
    comment: '訂單完成時間',
    unsigned: true,
    transformer: {
      to: (value: string) => value,
      from: (value: string) => {
        if (!value) return value;
        return dayjs(value, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss');
      },
    },
  })
  completedAt: string | null;

  complete(): void {
    this.isCompleted = true;
    this.completedAt = dayjs().format('YYYYMMDDHHmmss');
  }
}
