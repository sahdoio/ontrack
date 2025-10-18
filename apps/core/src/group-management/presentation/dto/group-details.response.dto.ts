import { ApiProperty } from '@nestjs/swagger';

class MemberDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  joinedAt: Date;
}

export class GroupDetailsResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: [MemberDto] })
  members: MemberDto[];

  @ApiProperty()
  memberCount: number;

  @ApiProperty()
  createdAt: Date;
}
