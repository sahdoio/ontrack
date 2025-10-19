import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ExpenseSplitEntity } from './expense-split.entity';

@Entity('expenses')
export class ExpenseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'group_id', type: 'uuid' })
  groupId: string;

  @Column({ name: 'payer_id', type: 'uuid' })
  payerId: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'integer', comment: 'Amount in cents' })
  amount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => ExpenseSplitEntity, (split) => split.expense, {
    cascade: true,
  })
  splits: ExpenseSplitEntity[];
}
