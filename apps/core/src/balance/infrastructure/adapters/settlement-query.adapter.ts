import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { ISettlementQueryPort } from '../../application/ports/settlement-query.port';
import { SettlementEntity } from '../../../shared/infrastructure/database/entities/settlement.entity';
import { GroupId, MemberId } from '../../../shared/domain/value-objects/id.vo';
import { Money } from '../../../shared/domain/value-objects/money.vo';

@Injectable()
export class SettlementQueryAdapter implements ISettlementQueryPort {
  constructor(
    @InjectRepository(SettlementEntity)
    private readonly settlementRepository: Repository<SettlementEntity>,
  ) {}

  async findByGroupId(
    groupId: GroupId,
  ): Promise<
    Array<{
      payerId: MemberId;
      receiverId: MemberId;
      amount: Money;
    }>
  > {
    const settlements = await this.settlementRepository.find({
      where: { groupId: groupId.value },
    });

    return settlements.map((settlement) => ({
      payerId: MemberId.create(settlement.payerId),
      receiverId: MemberId.create(settlement.receiverId),
      amount: Money.fromCents(settlement.amount),
    }));
  }
}
