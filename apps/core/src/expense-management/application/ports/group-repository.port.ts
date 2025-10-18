import { GroupId } from '../../../shared/domain/value-objects/id.vo';

// Port for accessing Group aggregate from Expense Management context
export interface IGroupQueryPort {
  exists(groupId: GroupId): Promise<boolean>;
  getMemberIds(groupId: GroupId): Promise<string[]>;
}

export const GROUP_QUERY_PORT = Symbol('IGroupQueryPort');
