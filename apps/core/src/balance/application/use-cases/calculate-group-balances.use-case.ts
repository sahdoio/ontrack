import { Inject, Injectable } from '@nestjs/common';
import {
  CalculateGroupBalancesInputDto,
  CalculateGroupBalancesOutputDto,
} from '../dto/calculate-balances.dto';
import { BALANCE_REPOSITORY } from '../../domain/repositories/balance.repository.interface';
import type { IBalanceRepository } from '../../domain/repositories/balance.repository.interface';
import { EXPENSE_QUERY_PORT } from '../ports/expense-query.port';
import type { IExpenseQueryPort } from '../ports/expense-query.port';
import { SETTLEMENT_QUERY_PORT } from '../ports/settlement-query.port';
import type { ISettlementQueryPort } from '../ports/settlement-query.port';
import { GROUP_QUERY_PORT } from '../ports/group-query.port';
import type { IGroupQueryPort } from '../ports/group-query.port';
import { EVENT_BUS } from '../ports/event-bus.port';
import type { IEventBus } from '../ports/event-bus.port';
import { GroupId, MemberId } from '../../../shared/domain/value-objects/id.vo';
import { BalanceCalculator } from '../../domain/services/balance-calculator.service';
import { Balance } from '../../domain/entities/balance.entity';
import { Money } from '../../../shared/domain/value-objects/money.vo';

@Injectable()
export class CalculateGroupBalancesUseCase {
  constructor(
    @Inject(BALANCE_REPOSITORY)
    private readonly balanceRepository: IBalanceRepository,
    @Inject(EXPENSE_QUERY_PORT)
    private readonly expenseQueryPort: IExpenseQueryPort,
    @Inject(SETTLEMENT_QUERY_PORT)
    private readonly settlementQueryPort: ISettlementQueryPort,
    @Inject(GROUP_QUERY_PORT)
    private readonly groupQueryPort: IGroupQueryPort,
    @Inject(EVENT_BUS)
    private readonly eventBus: IEventBus,
  ) {}

  async execute(
    input: CalculateGroupBalancesInputDto,
  ): Promise<CalculateGroupBalancesOutputDto> {
    const groupId = GroupId.create(input.groupId);

    // Get all member IDs
    const memberIdStrings = await this.groupQueryPort.getMemberIds(groupId);
    const memberIds = memberIdStrings.map((id) => MemberId.create(id));

    // Load all expenses
    const expenses = await this.expenseQueryPort.findByGroupId(groupId);

    // Load all settlements
    const settlements = await this.settlementQueryPort.findByGroupId(groupId);

    // Calculate balances using domain service
    const memberBalances = BalanceCalculator.calculateMemberBalances(
      memberIds,
      expenses,
      settlements,
    );

    // Check if balance already exists
    let balance = await this.balanceRepository.findByGroupId(groupId);

    if (balance) {
      // Update existing
      balance.updateBalances(memberBalances);
    } else {
      // Create new
      balance = Balance.create(groupId, memberBalances);
    }

    // Persist
    await this.balanceRepository.save(balance);

    // Publish domain events
    await this.eventBus.publishAll(balance.getDomainEvents());
    balance.clearDomainEvents();

    // Return output DTO
    return {
      groupId: balance.groupId.value,
      memberBalances: balance.memberBalances.map((mb) => ({
        memberId: mb.memberId.value,
        balanceInCents: mb.balance.amount,
        isPositive: mb.isPositive(),
      })),
      lastCalculatedAt: balance.lastCalculatedAt,
    };
  }
}
