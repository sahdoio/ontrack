import { Inject, Injectable } from '@nestjs/common';
import {
  ListGroupExpensesInputDto,
  ListGroupExpensesOutputDto,
} from '../dto/list-expenses.dto';
import { EXPENSE_REPOSITORY } from '../../domain/repositories/expense.repository.interface';
import type { IExpenseRepository } from '../../domain/repositories/expense.repository.interface';
import { GroupId } from '../../../shared/domain/value-objects/id.vo';
import { Money } from '../../../shared/domain/value-objects/money.vo';

@Injectable()
export class ListGroupExpensesUseCase {
  constructor(
    @Inject(EXPENSE_REPOSITORY)
    private readonly expenseRepository: IExpenseRepository,
  ) {}

  async execute(
    input: ListGroupExpensesInputDto,
  ): Promise<ListGroupExpensesOutputDto> {
    const groupId = GroupId.create(input.groupId);

    // Load all expenses for group
    const expenses = await this.expenseRepository.findByGroupId(groupId);

    // Calculate total
    const totalAmount = expenses.reduce(
      (sum, expense) => sum.add(expense.amount),
      Money.zero(),
    );

    // Return output DTO
    return {
      expenses: expenses.map((expense) => ({
        id: expense.id.value,
        payerId: expense.payerId.value,
        name: expense.name,
        amountInCents: expense.amount.amount,
        createdAt: expense.createdAt,
      })),
      totalCount: expenses.length,
      totalAmountInCents: totalAmount.amount,
    };
  }
}
