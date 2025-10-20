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
import { EVENT_BUS } from '../../../shared/application/ports/event-bus.port';
import type { IEventBus } from '../../../shared/application/ports/event-bus.port';
import { GroupId, MemberId } from '../../../shared/domain/value-objects/id.vo';
import { BalanceCalculator } from '../../domain/services/balance-calculator.service';
import { Balance } from '../../domain/entities/balance.entity';

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

    const memberIdStrings = await this.groupQueryPort.getMemberIds(groupId);
    const memberIds = memberIdStrings.map((id) => MemberId.create(id));

    const expenses = await this.expenseQueryPort.findByGroupId(groupId);

    const settlements = await this.settlementQueryPort.findByGroupId(groupId);

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

    await this.eventBus.publishAll(balance.getDomainEvents());
    balance.clearDomainEvents();

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
