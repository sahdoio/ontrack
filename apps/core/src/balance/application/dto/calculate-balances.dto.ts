export class CalculateGroupBalancesInputDto {
  groupId: string;
}

export class CalculateGroupBalancesOutputDto {
  groupId: string;
  memberBalances: Array<{
    memberId: string;
    balanceInCents: number;
    isPositive: boolean; // true = owed money, false = owes money
  }>;
  lastCalculatedAt: Date;
}
