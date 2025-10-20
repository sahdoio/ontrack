import { Inject, Injectable } from '@nestjs/common';
import {
  GetMemberBalanceInputDto,
  GetMemberBalanceOutputDto,
} from '../dto/get-member-balance.dto';
import { BALANCE_REPOSITORY } from '../../domain/repositories/balance.repository.interface';
import type { IBalanceRepository } from '../../domain/repositories/balance.repository.interface';
import { GroupId } from '../../../shared/domain/value-objects/id.vo';

@Injectable()
export class GetMemberBalanceUseCase {
  constructor(
    @Inject(BALANCE_REPOSITORY)
    private readonly balanceRepository: IBalanceRepository,
  ) {}

  async execute(
    input: GetMemberBalanceInputDto,
  ): Promise<GetMemberBalanceOutputDto> {
    const groupId = GroupId.create(input.groupId);

    const balance = await this.balanceRepository.findByGroupId(groupId);

    if (!balance) {
      throw new Error('Balance not calculated for this group yet');
    }

    const memberBalance = balance.getMemberBalance(input.memberId);

    if (!memberBalance) {
      throw new Error('Member not found in group');
    }

    return {
      memberId: memberBalance.memberId.value,
      balanceInCents: memberBalance.balance.amount,
      isPositive: memberBalance.isPositive(),
      lastCalculatedAt: balance.lastCalculatedAt,
    };
  }
}
