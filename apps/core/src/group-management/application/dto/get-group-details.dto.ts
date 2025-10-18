export class GetGroupDetailsInputDto {
  groupId: string;
}

export class GetGroupDetailsOutputDto {
  id: string;
  name: string;
  members: Array<{ id: string; name: string; joinedAt: Date }>;
  createdAt: Date;
  memberCount: number;
}
