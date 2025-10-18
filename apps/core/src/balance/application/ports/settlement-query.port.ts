import { GroupId, MemberId } from '../../../shared/domain/value-objects/id.vo';
import { Money } from '../../../shared/domain/value-objects/money.vo';

// Port for querying settlements from Balance context
export interface ISettlementQueryPort {
  findByGroupId(
    groupId: GroupId,
  ): Promise<
    Array<{
      payerId: MemberId;
      receiverId: MemberId;
      amount: Money;
    }>
  >;
}

export const SETTLEMENT_QUERY_PORT = Symbol('ISettlementQueryPort');
