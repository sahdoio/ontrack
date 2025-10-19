import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IExpenseQueryPort } from '../../application/ports/expense-query.port';
import { ExpenseEntity } from '../../../shared/infrastructure/database/entities/expense.entity';
import { ExpenseSplitEntity } from '../../../shared/infrastructure/database/entities/expense-split.entity';
import { GroupId, MemberId } from '../../../shared/domain/value-objects/id.vo';
import { Money } from '../../../shared/domain/value-objects/money.vo';

@Injectable()
export class ExpenseQueryAdapter implements IExpenseQueryPort {
  constructor(
    @InjectRepository(ExpenseEntity)
    private readonly expenseRepository: Repository<ExpenseEntity>,
    @InjectRepository(ExpenseSplitEntity)
    private readonly expenseSplitRepository: Repository<ExpenseSplitEntity>,
  ) {}

  async findByGroupId(
    groupId: GroupId,
  ): Promise<
    Array<{
      payerId: MemberId;
      amount: Money;
      splits: Array<{ memberId: MemberId; amount: Money }>;
    }>
  > {
    const expenses = await this.expenseRepository.find({
      where: { groupId: groupId.value },
    });

    const result: Array<{
      payerId: MemberId;
      amount: Money;
      splits: Array<{ memberId: MemberId; amount: Money }>;
    }> = [];

    for (const expense of expenses) {
      const splits = await this.expenseSplitRepository.find({
        where: { expenseId: expense.id },
      });

      result.push({
        payerId: MemberId.create(expense.payerId),
        amount: Money.fromCents(expense.amount),
        splits: splits.map((split) => ({
          memberId: MemberId.create(split.memberId),
          amount: Money.fromCents(split.amount),
        })),
      });
    }

    return result;
  }
}
