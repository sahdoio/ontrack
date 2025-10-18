export class AddMemberInputDto {
  groupId: string;
  memberName: string;
}

export class AddMemberOutputDto {
  memberId: string;
  memberName: string;
  joinedAt: Date;
}
