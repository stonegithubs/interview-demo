import { BaseEntity, Column, Entity, JoinColumn } from 'typeorm';
import { Entry } from './Entry';

@Entity('withdraw_entry_cb', { schema: 'eth_system' })
export class WithdrawEntryCb extends BaseEntity {
  @Column('bigint', { primary: true, name: 'withdraw_entry_id' })
  withdrawEntryId: string;

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

  @JoinColumn([{ name: 'withdraw_entry_id', referencedColumnName: 'id' }])
  withdrawEntry: Entry;
}
