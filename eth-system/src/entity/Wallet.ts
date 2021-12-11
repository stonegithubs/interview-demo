import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('wallet_address_uindex', ['address'], { unique: true })
@Entity('wallet', { schema: 'eth_system' })
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', {
    name: 'address',
    nullable: false,
    unique: true,
    comment: '錢包地址',
    length: 255,
  })
  address: string;

  @Column('varchar', {
    name: 'private_key',
    nullable: false,
    comment: '錢包私錀',
    length: 255,
  })
  privateKey: string;
}
