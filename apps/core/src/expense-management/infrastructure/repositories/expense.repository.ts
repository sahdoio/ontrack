import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IExpenseRepository } from '../../domain/repositories/expense.repository.interface';
import { Expense } from '../../domain/entities/expense.entity';
import {
  ExpenseId,
  GroupId,
  MemberId,
} from '../../../shared/domain/value-objects/id.vo';
import { Money } from '../../../shared/domain/value-objects/money.vo';
import { ExpenseSplit } from '../../../shared/domain/value-objects/expense-split.vo';
import { ExpenseEntity } from '../../../shared/infrastructure/database/entities/expense.entity';
import { ExpenseSplitEntity } from '../../../shared/infrastructure/database/entities/expense-split.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ExpenseRepository implements IExpenseRepository {
  constructor(
    @InjectRepository(ExpenseEntity)
    private readonly expenseEntityRepository: Repository<ExpenseEntity>,
    @InjectRepository(ExpenseSplitEntity)
    private readonly splitEntityRepository: Repository<ExpenseSplitEntity>,
  ) {}

  async save(expense: Expense): Promise<void> {
    const expenseEntity = new ExpenseEntity();
    expenseEntity.id = expense.id.value;
    expenseEntity.groupId = expense.groupId.value;
    expenseEntity.payerId = expense.payerId.value;
    expenseEntity.name = expense.name;
    expenseEntity.amount = expense.amount.amount;
    expenseEntity.createdAt = expense.createdAt;

    await this.expenseEntityRepository.save(expenseEntity);

    await this.splitEntityRepository.delete({ expenseId: expense.id.value });

    const splitEntities = expense.splits.map((split) => {
      const splitEntity = new ExpenseSplitEntity();
      splitEntity.id = uuidv4();
      splitEntity.expenseId = expense.id.value;
      splitEntity.memberId = split.memberId.value;
      splitEntity.amount = split.amount.amount;
      return splitEntity;
    });

    if (splitEntities.length > 0) {
      await this.splitEntityRepository.save(splitEntities);
    }
  }

  async findById(id: ExpenseId): Promise<Expense | null> {
    const expenseEntity = await this.expenseEntityRepository.findOne({
      where: { id: id.value },
      relations: ['splits'],
    });

    if (!expenseEntity) {
      return null;
    }

    return this.toDomain(expenseEntity);
  }

  async findByGroupId(groupId: GroupId): Promise<Expense[]> {
    const expenseEntities = await this.expenseEntityRepository.find({
      where: { groupId: groupId.value },
      relations: ['splits'],
      order: { createdAt: 'DESC' },
    });

    return expenseEntities.map((entity) => this.toDomain(entity));
  }

  async delete(id: ExpenseId): Promise<void> {
    await this.expenseEntityRepository.delete({ id: id.value });
  }

  async exists(id: ExpenseId): Promise<boolean> {
    const count = await this.expenseEntityRepository.count({
      where: { id: id.value },
    });
    return count > 0;
  }

  private toDomain(expenseEntity: ExpenseEntity): Expense {
    const splits = expenseEntity.splits.map((splitEntity) =>
      ExpenseSplit.create(
        MemberId.create(splitEntity.memberId),
        Money.fromCents(splitEntity.amount),
      ),
    );

    return Expense.reconstitute(
      ExpenseId.create(expenseEntity.id),
      GroupId.create(expenseEntity.groupId),
      MemberId.create(expenseEntity.payerId),
      expenseEntity.name,
      Money.fromCents(expenseEntity.amount),
      splits,
      expenseEntity.createdAt,
    );
  }
}
