import { ApiProperty } from '@nestjs/swagger';

class MemberResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  joinedAt: Date;
}

export class CreateGroupResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: [MemberResponseDto] })
  members: MemberResponseDto[];

  @ApiProperty()
  createdAt: Date;
}
