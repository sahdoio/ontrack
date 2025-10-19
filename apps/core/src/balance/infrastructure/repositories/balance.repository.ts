import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IBalanceRepository } from '../../domain/repositories/balance.repository.interface';
import { Balance } from '../../domain/entities/balance.entity';
import { GroupId, MemberId } from '../../../shared/domain/value-objects/id.vo';
import { Money } from '../../../shared/domain/value-objects/money.vo';
import { MemberBalance } from '../../domain/value-objects/member-balance.vo';
import { BalanceEntity } from '../../../shared/infrastructure/database/entities/balance.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BalanceRepository implements IBalanceRepository {
  constructor(
    @InjectRepository(BalanceEntity)
    private readonly balanceEntityRepository: Repository<BalanceEntity>,
  ) {}

  async save(balance: Balance): Promise<void> {
    // Delete existing balances for this group
    await this.balanceEntityRepository.delete({
      groupId: balance.groupId.value,
    });

    // Save new balances
    const balanceEntities = balance.memberBalances.map((memberBalance) => {
      const balanceEntity = new BalanceEntity();
      balanceEntity.id = uuidv4();
      balanceEntity.groupId = balance.groupId.value;
      balanceEntity.memberId = memberBalance.memberId.value;
      balanceEntity.balance = memberBalance.balance.amount;
      balanceEntity.lastCalculatedAt = balance.lastCalculatedAt;
      return balanceEntity;
    });

    if (balanceEntities.length > 0) {
      await this.balanceEntityRepository.save(balanceEntities);
    }
  }

  async findByGroupId(groupId: GroupId): Promise<Balance | null> {
    const balanceEntities = await this.balanceEntityRepository.find({
      where: { groupId: groupId.value },
    });

    if (balanceEntities.length === 0) {
      return null;
    }

    return this.toDomain(groupId, balanceEntities);
  }

  async delete(groupId: GroupId): Promise<void> {
    await this.balanceEntityRepository.delete({ groupId: groupId.value });
  }

  private toDomain(
    groupId: GroupId,
    balanceEntities: BalanceEntity[],
  ): Balance {
    const memberBalances = balanceEntities.map((entity) =>
      MemberBalance.create(
        MemberId.create(entity.memberId),
        Money.fromCents(entity.balance),
      ),
    );

    const lastCalculatedAt = balanceEntities[0]?.lastCalculatedAt || new Date();

    return Balance.reconstitute(groupId, memberBalances, lastCalculatedAt);
  }
}
