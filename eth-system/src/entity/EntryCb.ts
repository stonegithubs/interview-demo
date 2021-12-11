import { BaseEntity, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Entry } from './Entry';

@Entity('entry_cb', { schema: 'eth_system' })
export class EntryCb extends BaseEntity {
  @Column('bigint', { primary: true, name: 'entry_id' })
  entryId: string;

  @Column('int', {
    name: 'try_count',
    comment: '回調嘗試次數',
    default: () => '0',
  })
  tryCount: number;

  @Column('tinyint', {
    name: 'confirm',
    comment: '回調是否成功',
    width: 1,
    default: () => '0',
  })
  confirm: boolean;

  @Column('bigint', { name: 'try_at', nullable: true, comment: '嘗試回調時間' })
  tryAt: string | null;

  @JoinColumn([{ name: 'entry_id', referencedColumnName: 'id' }])
  entry: Entry;
}
