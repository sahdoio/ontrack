import { Expense } from '../entities/expense.entity';
import { ExpenseId, GroupId } from '../../../shared/domain/value-objects/id.vo';

export interface IExpenseRepository {
  save(expense: Expense): Promise<void>;
  findById(id: ExpenseId): Promise<Expense | null>;
  findByGroupId(groupId: GroupId): Promise<Expense[]>;
  delete(id: ExpenseId): Promise<void>;
  exists(id: ExpenseId): Promise<boolean>;
}

export const EXPENSE_REPOSITORY = Symbol('IExpenseRepository');
