import { Inject, Injectable } from '@nestjs/common';
import {
  RecordSettlementInputDto,
  RecordSettlementOutputDto,
} from '../dto/record-settlement.dto';
import { SETTLEMENT_REPOSITORY } from '../../domain/repositories/settlement.repository.interface';
import type { ISettlementRepository } from '../../domain/repositories/settlement.repository.interface';
import { GROUP_QUERY_PORT } from '../ports/group-query.port';
import type { IGroupQueryPort } from '../ports/group-query.port';
import { EVENT_BUS } from '../ports/event-bus.port';
import type { IEventBus } from '../ports/event-bus.port';
import { GroupId, MemberId } from '../../../shared/domain/value-objects/id.vo';
import { Money } from '../../../shared/domain/value-objects/money.vo';
import { Settlement } from '../../domain/entities/settlement.entity';

@Injectable()
export class RecordSettlementUseCase {
  constructor(
    @Inject(SETTLEMENT_REPOSITORY)
    private readonly settlementRepository: ISettlementRepository,
    @Inject(GROUP_QUERY_PORT)
    private readonly groupQueryPort: IGroupQueryPort,
    @Inject(EVENT_BUS)
    private readonly eventBus: IEventBus,
  ) {}

  async execute(
    input: RecordSettlementInputDto,
  ): Promise<RecordSettlementOutputDto> {
    const groupId = GroupId.create(input.groupId);

    // Get all member IDs
    const memberIdStrings = await this.groupQueryPort.getMemberIds(groupId);
    const memberIds = memberIdStrings.map((id) => MemberId.create(id));

    // Create value objects
    const payerId = MemberId.create(input.payerId);
    const receiverId = MemberId.create(input.receiverId);
    const amount = Money.fromCents(input.amountInCents);

    // Create settlement aggregate (enforces invariants)
    const settlement = Settlement.create(
      groupId,
      payerId,
      receiverId,
      amount,
      memberIds,
    );

    // Persist
    await this.settlementRepository.save(settlement);

    // Publish domain events
    await this.eventBus.publishAll(settlement.getDomainEvents());
    settlement.clearDomainEvents();

    // Return output DTO
    return {
      id: settlement.id.value,
      groupId: settlement.groupId.value,
      payerId: settlement.payerId.value,
      receiverId: settlement.receiverId.value,
      amountInCents: settlement.amount.amount,
      createdAt: settlement.createdAt,
    };
  }
}
