import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISettlementRepository } from '../../domain/repositories/settlement.repository.interface';
import { Settlement } from '../../domain/entities/settlement.entity';
import {
  SettlementId,
  GroupId,
  MemberId,
} from '../../../shared/domain/value-objects/id.vo';
import { Money } from '../../../shared/domain/value-objects/money.vo';
import { SettlementEntity } from '../../../shared/infrastructure/database/entities/settlement.entity';

@Injectable()
export class SettlementRepository implements ISettlementRepository {
  constructor(
    @InjectRepository(SettlementEntity)
    private readonly settlementEntityRepository: Repository<SettlementEntity>,
  ) {}

  async save(settlement: Settlement): Promise<void> {
    const settlementEntity = new SettlementEntity();
    settlementEntity.id = settlement.id.value;
    settlementEntity.groupId = settlement.groupId.value;
    settlementEntity.payerId = settlement.payerId.value;
    settlementEntity.receiverId = settlement.receiverId.value;
    settlementEntity.amount = settlement.amount.amount;
    settlementEntity.createdAt = settlement.createdAt;

    await this.settlementEntityRepository.save(settlementEntity);
  }

  async findById(id: SettlementId): Promise<Settlement | null> {
    const settlementEntity = await this.settlementEntityRepository.findOne({
      where: { id: id.value },
    });

    if (!settlementEntity) {
      return null;
    }

    return this.toDomain(settlementEntity);
  }

  async findByGroupId(groupId: GroupId): Promise<Settlement[]> {
    const settlementEntities = await this.settlementEntityRepository.find({
      where: { groupId: groupId.value },
      order: { createdAt: 'DESC' },
    });

    return settlementEntities.map((entity) => this.toDomain(entity));
  }

  async delete(id: SettlementId): Promise<void> {
    await this.settlementEntityRepository.delete({ id: id.value });
  }

  async exists(id: SettlementId): Promise<boolean> {
    const count = await this.settlementEntityRepository.count({
      where: { id: id.value },
    });
    return count > 0;
  }

  private toDomain(settlementEntity: SettlementEntity): Settlement {
    return Settlement.reconstitute(
      SettlementId.create(settlementEntity.id),
      GroupId.create(settlementEntity.groupId),
      MemberId.create(settlementEntity.payerId),
      MemberId.create(settlementEntity.receiverId),
      Money.fromCents(settlementEntity.amount),
      settlementEntity.createdAt,
    );
  }
}
