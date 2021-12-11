import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Currency } from './Currency';
import { Merchant } from './Merchant';
import dayjs from 'dayjs';
import { EntryBase } from './EntryBase';
import { User } from './User';

@Index('withdraw_entry_cb_id_index', ['cbId'], {})
@Index('withdraw_entry_currency_id_fk', ['currencyId'], {})
@Index('withdraw_entry_from_address_index', ['fromAddress'], {})
@Index('withdraw_entry_merchant_id_fk', ['merchantId'], {})
@Index('withdraw_entry_to_address_index', ['toAddress'], {})
@Entity('withdraw_entry', { schema: 'eth_system' })
export class WithdrawEntry extends EntryBase {
  @PrimaryColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column('decimal', {
    name: 'amount',
    comment: '人民幣',
    precision: 27,
    scale: 9,
  })
  amount: string;

  @Column('decimal', { name: 'rate', comment: '匯率', precision: 24, scale: 6 })
  rate: string;

  @Column('varchar', { name: 'cb_url', comment: '回調網址', length: 2500 })
  cbUrl: string;

  @Column('bigint', {
    name: 'cb_id',
    unique: true,
    default: () => '0',
  })
  cbId: string;

  @Column('int', { name: 'gas_price', nullable: true })
  gasPrice: number | null;

  @ManyToOne(() => Currency, (currency) => currency.withdrawEntries, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'currency_id', referencedColumnName: 'id' }])
  currency: Currency;

  @ManyToOne(() => Merchant, (merchant) => merchant.withdrawEntries, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'merchant_id', referencedColumnName: 'id' }])
  merchant: Merchant;

  @ManyToOne(() => User, (user) => user.withdrawEntries, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  complete(): void {
    this.isCompleted = true;
    this.completedAt = dayjs().format('YYYYMMDDHHmmss');
  }
}
