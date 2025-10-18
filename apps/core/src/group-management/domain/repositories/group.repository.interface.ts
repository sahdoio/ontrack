import { Group } from '../entities/group.entity';
import { GroupId } from '../../../shared/domain/value-objects/id.vo';

export interface IGroupRepository {
  save(group: Group): Promise<void>;
  findById(id: GroupId): Promise<Group | null>;
  findAll(): Promise<Group[]>;
  delete(id: GroupId): Promise<void>;
  exists(id: GroupId): Promise<boolean>;
}

export const GROUP_REPOSITORY = Symbol('IGroupRepository');
