import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('gas_price', { schema: 'eth_system' })
export class GasPrice extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'price', comment: '價格' })
  price: number;

  @Column('bigint', { name: 'created_at', comment: '建立時間' })
  createdAt: string;
}
