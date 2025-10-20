import { Inject, Injectable } from '@nestjs/common';
import {
  RecordExpenseInputDto,
  RecordExpenseOutputDto,
} from '../dto/record-expense.dto';
import { EXPENSE_REPOSITORY } from '../../domain/repositories/expense.repository.interface';
import type { IExpenseRepository } from '../../domain/repositories/expense.repository.interface';
import { GROUP_QUERY_PORT } from '../ports/group-repository.port';
import type { IGroupQueryPort } from '../ports/group-repository.port';
import { EVENT_BUS } from '../../../shared/application/ports/event-bus.port';
import type { IEventBus } from '../../../shared/application/ports/event-bus.port';
import { GroupId, MemberId } from '../../../shared/domain/value-objects/id.vo';
import { Money } from '../../../shared/domain/value-objects/money.vo';
import { ExpenseSplit } from '../../../shared/domain/value-objects/expense-split.vo';
import { Expense } from '../../domain/entities/expense.entity';
import { SplitCalculator } from '../../domain/services/split-calculator.service';

@Injectable()
export class RecordExpenseUseCase {
  constructor(
    @Inject(EXPENSE_REPOSITORY)
    private readonly expenseRepository: IExpenseRepository,
    @Inject(GROUP_QUERY_PORT)
    private readonly groupQueryPort: IGroupQueryPort,
    @Inject(EVENT_BUS)
    private readonly eventBus: IEventBus,
  ) {}

  async execute(input: RecordExpenseInputDto): Promise<RecordExpenseOutputDto> {
    const groupId = GroupId.create(input.groupId);
    const groupExists = await this.groupQueryPort.exists(groupId);

    if (!groupExists) {
      throw new Error('Group not found');
    }

    const memberIdStrings = await this.groupQueryPort.getMemberIds(groupId);
    const memberIds = memberIdStrings.map((id) => MemberId.create(id));

    const payerId = MemberId.create(input.payerId);
    if (!memberIds.some((id) => id.equals(payerId))) {
      throw new Error('Payer must be a member of the group');
    }

    const amount = Money.fromCents(input.amountInCents);

    let splits: ExpenseSplit[];
    if (input.splitEqually || !input.customSplits) {
      splits = SplitCalculator.calculateEqualSplits(amount, memberIds);
    } else {
      splits = input.customSplits.map((split) =>
        ExpenseSplit.create(
          MemberId.create(split.memberId),
          Money.fromCents(split.amountInCents),
        ),
      );
    }

    const expense = Expense.create(
      groupId,
      payerId,
      input.name,
      amount,
      splits,
      memberIds,
    );

    await this.expenseRepository.save(expense);

    await this.eventBus.publishAll(expense.getDomainEvents());
    expense.clearDomainEvents();

    return {
      id: expense.id.value,
      groupId: expense.groupId.value,
      payerId: expense.payerId.value,
      name: expense.name,
      amountInCents: expense.amount.amount,
      splits: expense.splits.map((s) => ({
        memberId: s.memberId.value,
        amountInCents: s.amount.amount,
      })),
      createdAt: expense.createdAt,
    };
  }
}
