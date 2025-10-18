import { ApiProperty } from '@nestjs/swagger';

class ExpenseSplitDto {
  @ApiProperty()
  memberId: string;

  @ApiProperty()
  amountInCents: number;
}

export class RecordExpenseResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  groupId: string;

  @ApiProperty()
  payerId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  amountInCents: number;

  @ApiProperty({ type: [ExpenseSplitDto] })
  splits: ExpenseSplitDto[];

  @ApiProperty()
  createdAt: Date;
}
