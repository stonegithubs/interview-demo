import { BaseEntity, Column, Entity } from 'typeorm';

@Entity('withdraw_gas_restrict', { schema: 'eth_system' })
export class WithdrawGasRestrict extends BaseEntity {
  @Column('int', { primary: true, name: 'id' })
  id: number;

  @Column('int', { name: 'gas', comment: 'gas price上限 超過就不交易' })
  gas: number;
}
