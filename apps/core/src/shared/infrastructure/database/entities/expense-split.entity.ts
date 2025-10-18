import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ExpenseEntity } from './expense.entity';

@Entity('expense_splits')
export class ExpenseSplitEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'expense_id', type: 'uuid' })
  expenseId: string;

  @Column({ name: 'member_id', type: 'uuid' })
  memberId: string;

  @Column({ type: 'integer', comment: 'Amount in cents' })
  amount: number;

  @ManyToOne(() => ExpenseEntity, (expense) => expense.splits)
  @JoinColumn({ name: 'expense_id' })
  expense: ExpenseEntity;
}
