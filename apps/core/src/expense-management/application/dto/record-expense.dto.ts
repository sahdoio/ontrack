export class RecordExpenseInputDto {
  groupId: string;
  payerId: string;
  name: string;
  amountInCents: number;
  splitEqually?: boolean; // Optional: if true, use SplitCalculator
  customSplits?: Array<{ memberId: string; amountInCents: number }>; // Optional: custom splits
}

export class RecordExpenseOutputDto {
  id: string;
  groupId: string;
  payerId: string;
  name: string;
  amountInCents: number;
  splits: Array<{ memberId: string; amountInCents: number }>;
  createdAt: Date;
}
