import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { ContractCurrency } from './ContractCurrency';
import { Merchant } from './Merchant';

@Index('contract_address_index', ['address'], {})
@Index('contract_merchant_id_fk', ['merchantId'], {})
@Entity('contract', { schema: 'eth_system' })
export class Contract extends BaseEntity {
  @Column('varchar', {
    primary: true,
    name: 'address',
    comment: '合約地址',
    length: 255,
  })
  address: string;

  @Column('int', { name: 'merchant_id', comment: '商戶id' })
  merchantId: number;

  @Column('varchar', {
    name: 'name',
    nullable: true,
    comment: '合約名稱',
    length: 255,
  })
  name: string | null;

  @OneToOne(
    () => ContractCurrency,
    (contractCurrency) => contractCurrency.contract,
  )
  contractCurrency: ContractCurrency;

  @ManyToOne(() => Merchant, (merchant) => merchant.contracts, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'merchant_id', referencedColumnName: 'id' }])
  merchant: Merchant;
}
