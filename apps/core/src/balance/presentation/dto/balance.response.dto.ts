import { ApiProperty } from '@nestjs/swagger';

class MemberBalanceDto {
  @ApiProperty()
  memberId: string;

  @ApiProperty({
    description: 'Balance in cents (positive = owed, negative = owes)',
  })
  balanceInCents: number;

  @ApiProperty()
  isPositive: boolean;
}

export class BalanceResponseDto {
  @ApiProperty()
  groupId: string;

  @ApiProperty({ type: [MemberBalanceDto] })
  memberBalances: MemberBalanceDto[];

  @ApiProperty()
  lastCalculatedAt: Date;
}
