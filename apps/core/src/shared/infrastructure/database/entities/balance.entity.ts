import {
  Entity,
  Column,
  PrimaryColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity('balances')
@Unique(['groupId', 'memberId'])
export class BalanceEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'group_id', type: 'uuid' })
  groupId: string;

  @Column({ name: 'member_id', type: 'uuid' })
  memberId: string;

  @Column({ type: 'integer', comment: 'Balance in cents, can be negative' })
  balance: number;

  @UpdateDateColumn({ name: 'last_calculated_at' })
  lastCalculatedAt: Date;
}
