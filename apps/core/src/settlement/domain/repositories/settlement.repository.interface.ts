import { Settlement } from '../entities/settlement.entity';
import {
  SettlementId,
  GroupId,
} from '../../../shared/domain/value-objects/id.vo';

export interface ISettlementRepository {
  save(settlement: Settlement): Promise<void>;
  findById(id: SettlementId): Promise<Settlement | null>;
  findByGroupId(groupId: GroupId): Promise<Settlement[]>;
  delete(id: SettlementId): Promise<void>;
  exists(id: SettlementId): Promise<boolean>;
}

export const SETTLEMENT_REPOSITORY = Symbol('ISettlementRepository');
