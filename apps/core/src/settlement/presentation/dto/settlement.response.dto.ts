import { ApiProperty } from '@nestjs/swagger';

export class SettlementResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  groupId: string;

  @ApiProperty()
  payerId: string;

  @ApiProperty()
  receiverId: string;

  @ApiProperty()
  amountInCents: number;

  @ApiProperty()
  createdAt: Date;
}

class SettlementItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  payerId: string;

  @ApiProperty()
  receiverId: string;

  @ApiProperty()
  amountInCents: number;

  @ApiProperty()
  createdAt: Date;
}

export class ListSettlementsResponseDto {
  @ApiProperty({ type: [SettlementItemDto] })
  settlements: SettlementItemDto[];

  @ApiProperty()
  totalCount: number;
}
