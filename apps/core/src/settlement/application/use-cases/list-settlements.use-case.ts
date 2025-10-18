import { Inject, Injectable } from '@nestjs/common';
import { ListSettlementsInputDto, ListSettlementsOutputDto } from '../dto/list-settlements.dto';
import { SETTLEMENT_REPOSITORY } from '../../domain/repositories/settlement.repository.interface';
import type { ISettlementRepository } from '../../domain/repositories/settlement.repository.interface';
import { GroupId } from '../../../shared/domain/value-objects/id.vo';

@Injectable()
export class ListSettlementsUseCase {
  constructor(
    @Inject(SETTLEMENT_REPOSITORY)
    private readonly settlementRepository: ISettlementRepository,
  ) {}

  async execute(input: ListSettlementsInputDto): Promise<ListSettlementsOutputDto> {
    const groupId = GroupId.create(input.groupId);

    // Load all settlements
    const settlements = await this.settlementRepository.findByGroupId(groupId);

    // Return output DTO
    return {
      settlements: settlements.map((settlement) => ({
        id: settlement.id.value,
        payerId: settlement.payerId.value,
        receiverId: settlement.receiverId.value,
        amountInCents: settlement.amount.amount,
        createdAt: settlement.createdAt,
      })),
      totalCount: settlements.length,
    };
  }
}
