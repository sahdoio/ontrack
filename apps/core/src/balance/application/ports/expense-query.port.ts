import { GroupId, MemberId } from '../../../shared/domain/value-objects/id.vo';
import { Money } from '../../../shared/domain/value-objects/money.vo';

// Port for querying expenses from Balance context
export interface IExpenseQueryPort {
  findByGroupId(
    groupId: GroupId,
  ): Promise<
    Array<{
      payerId: MemberId;
      amount: Money;
      splits: Array<{ memberId: MemberId; amount: Money }>;
    }>
  >;
}

export const EXPENSE_QUERY_PORT = Symbol('IExpenseQueryPort');
