import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ContractCurrency } from './ContractCurrency';
import { Entry } from './Entry';
import { WithdrawEntry } from './WithdrawEntry';
import { OwnerWithdrawEntry } from './OwnerWithdrawEntry';
import { OwnerWithdrawConfig } from './OwnerWithdrawConfig';

@Entity('currency', { schema: 'eth_system' })
export class Currency extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', {
    name: 'name',
    nullable: true,
    comment: '貨幣名稱',
    length: 255,
  })
  name: string | null;

  @OneToMany(
    () => ContractCurrency,
    (contractCurrency) => contractCurrency.currency,
  )
  contractCurrencies: ContractCurrency[];

  @OneToMany(
    () => OwnerWithdrawConfig,
    (ownerWithdrawConfig) => ownerWithdrawConfig.currency
  )
  ownerWithdrawConfigs: OwnerWithdrawConfig[];

  @OneToMany(() => Entry, (entry) => entry.currency)
  entries: Entry[];

  @OneToMany(() => WithdrawEntry, (withdrawEntry) => withdrawEntry.currency)
  withdrawEntries: WithdrawEntry[];

  @OneToMany(() => OwnerWithdrawEntry, (ownerWithdraw) => ownerWithdraw.currency)
  ownerWithdraws: OwnerWithdrawEntry[];
}
