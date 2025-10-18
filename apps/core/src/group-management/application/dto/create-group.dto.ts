export class CreateGroupInputDto {
  name: string;
  memberNames: string[];
}

export class CreateGroupOutputDto {
  id: string;
  name: string;
  members: Array<{ id: string; name: string; joinedAt: Date }>;
  createdAt: Date;
}
