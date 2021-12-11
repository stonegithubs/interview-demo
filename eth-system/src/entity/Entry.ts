import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Currency } from './Currency';
import { Merchant } from './Merchant';
import { EntryBase } from './EntryBase';
import { User } from './User';

@Index('entry_cb_id_index', ['cbId'], {})
@Index('entry_currency_id_fk', ['currencyId'], {})
@Index('entry_to_address_index', ['toAddress'], {})
@Index('entry_txn_hash_index', ['txnHash'], {})
@Entity('entry', { schema: 'eth_system' })
export class Entry extends EntryBase {
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

  @Column('decimal', {
    name: 'random_amount',
    comment: '隨機小數',
    precision: 10,
    scale: 6,
  })
  randomAmount: string;

  @Column('varchar', { name: 'cb_url', comment: '回調網址', length: 2500 })
  cbUrl: string;

  @Column('bigint', { name: 'cb_id', unique: true, comment: '' })
  cbId: string;

  @ManyToOne(() => Currency, (currency) => currency.entries, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'currency_id', referencedColumnName: 'id' }])
  currency: Currency;

  @ManyToOne(() => Merchant, (merchant) => merchant.entries, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'merchant_id', referencedColumnName: 'id' }])
  merchant: Merchant;

  @ManyToOne(() => User, (user) => user.entries, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
