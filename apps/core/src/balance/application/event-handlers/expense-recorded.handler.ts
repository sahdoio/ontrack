import { Injectable, Inject, Logger } from '@nestjs/common';
import { IEventHandler } from '../../../shared/application/interfaces/event-handler.interface';
import { ExpenseRecorded } from '../../../expense-management/domain/events/expense-recorded.event';
import { IdempotencyService } from '../../../shared/application/services/idempotency.service';
import { BALANCE_REPOSITORY } from '../../domain/repositories/balance.repository.interface';
import type { IBalanceRepository } from '../../domain/repositories/balance.repository.interface';
import { EXPENSE_QUERY_PORT } from '../ports/expense-query.port';
import type { IExpenseQueryPort } from '../ports/expense-query.port';
import { SETTLEMENT_QUERY_PORT } from '../ports/settlement-query.port';
import type { ISettlementQueryPort } from '../ports/settlement-query.port';
import { GROUP_QUERY_PORT } from '../ports/group-query.port';
import type { IGroupQueryPort } from '../ports/group-query.port';
import { GroupId, MemberId } from '../../../shared/domain/value-objects/id.vo';
import { BalanceCalculator } from '../../domain/services/balance-calculator.service';
import { Balance } from '../../domain/entities/balance.entity';

@Injectable()
export class ExpenseRecordedHandler implements IEventHandler<ExpenseRecorded> {
  private readonly logger = new Logger(ExpenseRecordedHandler.name);
  private readonly handlerName = 'ExpenseRecordedHandler';

  constructor(
    private readonly idempotencyService: IdempotencyService,
    @Inject(BALANCE_REPOSITORY)
    private readonly balanceRepository: IBalanceRepository,
    @Inject(EXPENSE_QUERY_PORT)
    private readonly expenseQueryPort: IExpenseQueryPort,
    @Inject(SETTLEMENT_QUERY_PORT)
    private readonly settlementQueryPort: ISettlementQueryPort,
    @Inject(GROUP_QUERY_PORT)
    private readonly groupQueryPort: IGroupQueryPort,
  ) {}

  canHandle(eventName: string): boolean {
    return eventName === 'ExpenseRecorded';
  }

  async handle(event: ExpenseRecorded): Promise<void> {
    const isProcessed = await this.idempotencyService.isEventProcessed(
      event.eventId,
      this.handlerName,
    );

    if (isProcessed) {
      this.logger.log(
        `Event ${event.eventId} already processed by ${this.handlerName}, skipping`,
      );
      return;
    }

    try {
      this.logger.log(
        `Processing ExpenseRecorded event: ${event.eventId} for group ${event.groupId}`,
      );

      const groupId = GroupId.create(event.groupId);
      const memberIdStrings = await this.groupQueryPort.getMemberIds(groupId);
      const memberIds = memberIdStrings.map((id) => MemberId.create(id));

      const expenses = await this.expenseQueryPort.findByGroupId(groupId);
      const settlements =
        await this.settlementQueryPort.findByGroupId(groupId);

      const memberBalances = BalanceCalculator.calculateMemberBalances(
        memberIds,
        expenses,
        settlements,
      );

      let balance = await this.balanceRepository.findByGroupId(groupId);

      if (balance) {
        balance.updateBalances(memberBalances);
      } else {
        balance = Balance.create(groupId, memberBalances);
      }

      await this.balanceRepository.save(balance);

      await this.idempotencyService.markEventAsProcessed(
        event.eventId,
        event.eventName,
        event.aggregateId,
        this.handlerName,
      );

      this.logger.log(
        `Successfully processed ExpenseRecorded event: ${event.eventId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to process ExpenseRecorded event: ${event.eventId}`,
        error,
      );
      throw error;
    }
  }
}
