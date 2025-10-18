import { ApiProperty } from '@nestjs/swagger';

class ExpenseItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  payerId: string;

  @ApiProperty({ required: false })
  payerName?: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  amountInCents: number;

  @ApiProperty()
  createdAt: Date;
}

export class ListExpensesResponseDto {
  @ApiProperty({ type: [ExpenseItemDto] })
  expenses: ExpenseItemDto[];

  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  totalAmountInCents: number;
}
