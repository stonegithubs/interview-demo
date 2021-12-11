import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('rate', { schema: 'eth_system' })
export class Rate extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'currency', comment: '幣別', length: 255 })
  currency: string;

  @Column('varchar', {
    name: 'vs_currency',
    comment: '比較的幣別',
    length: 255,
  })
  vsCurrency: string;

  @Column('decimal', { name: 'rate', comment: '匯率', precision: 24, scale: 6 })
  rate: string;

  @Column('bigint', { name: 'created_at', comment: '建立日期', unsigned: true })
  createdAt: string;
}
