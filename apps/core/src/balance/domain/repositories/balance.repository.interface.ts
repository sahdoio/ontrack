import { Balance } from '../entities/balance.entity';
import { GroupId } from '../../../shared/domain/value-objects/id.vo';

export interface IBalanceRepository {
  save(balance: Balance): Promise<void>;
  findByGroupId(groupId: GroupId): Promise<Balance | null>;
  delete(groupId: GroupId): Promise<void>;
}

export const BALANCE_REPOSITORY = Symbol('IBalanceRepository');
