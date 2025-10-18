export class RecordSettlementInputDto {
  groupId: string;
  payerId: string;
  receiverId: string;
  amountInCents: number;
}

export class RecordSettlementOutputDto {
  id: string;
  groupId: string;
  payerId: string;
  receiverId: string;
  amountInCents: number;
  createdAt: Date;
}
