export class ListSettlementsInputDto {
  groupId: string;
}

export class ListSettlementsOutputDto {
  settlements: Array<{
    id: string;
    payerId: string;
    receiverId: string;
    amountInCents: number;
    createdAt: Date;
  }>;
  totalCount: number;
}
