import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Currency } from './Currency';
import { Merchant } from './Merchant';
import { User } from './User';
import { EntryBase } from './EntryBase';

@Index('owner_withdraw_entry_currency_id_fk', ['currencyId'], {})
@Index('owner_withdraw_entry_merchant_id_fk', ['merchantId'], {})
@Index('owner_withdraw_entry_user_id_fk', ['userId'], {})
@Index(
  'owner_withdraw_entry_from_address_to_address_index',
  ['fromAddress', 'toAddress'],
  {},
)
@Entity('owner_withdraw_entry', { schema: 'eth_system' })
export class OwnerWithdrawEntry extends EntryBase {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'gas_price', nullable: true })
  gasPrice: number | null;

  @ManyToOne(() => Currency, (currency) => currency.ownerWithdraws, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'currency_id', referencedColumnName: 'id' }])
  currency: Currency;

  @ManyToOne(() => Merchant, (merchant) => merchant.ownerWithdrawEntries, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'merchant_id', referencedColumnName: 'id' }])
  merchant: Merchant;

  @ManyToOne(() => User, (user) => user.ownerWithdrawEntries, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
