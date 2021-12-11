import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Contract } from './Contract';
import { Currency } from './Currency';
import numeral from 'numeral';
import BalanceNotEnough from '../exception/balance.not.enough.exception';
import dayjs from 'dayjs';

@Index('contract_currency_currency_id_fk', ['currencyId'], {})
@Index('contract_currency_contract_address_id_fk', ['contractAddress'], {})
@Entity('contract_currency', { schema: 'eth_system' })
export class ContractCurrency extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', {
    primary: true,
    name: 'contract_address',
    comment: '合約錢包地址',
    length: 255,
  })
  contractAddress: string;

  @Column('int', { name: 'currency_id', comment: '貨幣id' })
  currencyId: number;

  @Column('decimal', {
    name: 'balance',
    nullable: true,
    comment: '貨幣數量',
    precision: 27,
    scale: 9,
    default: () => '0.000000000',
    transformer: {
      to: (value: string) => value,
      from: (value: string) => {
        return numeral(value).format('0.000000');
      },
    },
  })
  balance: string | null;

  @Column('decimal', {
    name: 'fee',
    nullable: true,
    comment: '貨幣手續費',
    precision: 27,
    scale: 9,
    default: () => '0.000000000',
    transformer: {
      to: (value: string) => value,
      from: (value: string) => {
        return numeral(value).format('0.000000');
      },
    },
  })
  fee: string | null;

  @OneToOne(() => Contract, (contract) => contract.contractCurrency, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'contract_address', referencedColumnName: 'address' }])
  contract: Contract;

  @ManyToOne(() => Currency, (currency) => currency.contractCurrencies, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'currency_id', referencedColumnName: 'id' }])
  currency: Currency;

  increaseBalance(amount: string | number): void {
    this.balance = (numeral(this.balance).value() + numeral(amount).value()).toString();
  }

  decreaseBalance(amount: string | number): void {
    const balance = numeral(this.balance).subtract(numeral(amount).value());
    if (balance.value() < 0) {
      throw new BalanceNotEnough({ msg: 'Balance not enough' });
    }
    this.balance = balance.format('0.000000', Math.floor);
  }

  increaseFee(amount: string | number): void {
    this.fee = numeral(this.fee).add(numeral(amount).value())
      .format('0.000000', Math.floor);
  }

  decreaseFee(amount: string | number): void {
    const fee = (numeral(this.balance).value() - numeral(amount).value());
    if (fee < 0) {
      throw new Error('Fee not enough');
    }
    this.fee = fee.toString();
  }
}
