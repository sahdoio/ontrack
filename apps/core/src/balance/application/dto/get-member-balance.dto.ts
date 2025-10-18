export class GetMemberBalanceInputDto {
  groupId: string;
  memberId: string;
}

export class GetMemberBalanceOutputDto {
  memberId: string;
  balanceInCents: number;
  isPositive: boolean;
  lastCalculatedAt: Date;
}
