export class ListGroupExpensesInputDto {
  groupId: string;
}

export class ListGroupExpensesOutputDto {
  expenses: Array<{
    id: string;
    payerId: string;
    payerName?: string;
    name: string;
    amountInCents: number;
    createdAt: Date;
  }>;
  totalCount: number;
  totalAmountInCents: number;
}
