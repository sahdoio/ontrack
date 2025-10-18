import { GroupId } from '../../../shared/domain/value-objects/id.vo';

// Port for querying group data from Settlement context
export interface IGroupQueryPort {
  getMemberIds(groupId: GroupId): Promise<string[]>;
}

export const GROUP_QUERY_PORT = Symbol('IGroupQueryPort');
