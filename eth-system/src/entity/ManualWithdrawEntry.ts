import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('manual_withdraw_entry_txn_hash_uindex', ['txnHash'], { unique: true })
@Entity('manual_withdraw_entry', { schema: 'eth_system' })
export class ManualWithdrawEntry extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', {
    name: 'txn_hash',
    unique: true,
    comment: 'txn hash',
    length: 255,
  })
  txnHash: string;

  @Column('decimal', {
    name: 'crypto_amount',
    comment: '加密貨幣數量',
    precision: 27,
    scale: 9,
  })
  cryptoAmount: string;

  @Column('bigint', { name: 'created_at', nullable: true })
  createdAt: string | null;

  @Column('tinyint', { name: 'is_process', width: 1, default: () => '0' })
  isProcess: boolean;

  @Column('tinyint', { name: 'is_confirmed', width: 1, default: () => '0' })
  isConfirmed: boolean;

  @Column('varchar', { name: 'from_address', length: 255 })
  fromAddress: string;

  @Column('varchar', { name: 'to_address', length: 255 })
  toAddress: string;

  @Column('int', { name: 'merchant_id' })
  merchantId: number;

  @Column('int', { name: 'currency_id' })
  currencyId: number;
}
