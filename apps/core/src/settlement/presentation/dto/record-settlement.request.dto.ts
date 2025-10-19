import { IsUUID, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecordSettlementRequestDto {
  @ApiProperty({
    example: 'member-uuid-123',
    description: 'ID of member who is paying',
  })
  @IsUUID()
  payerId: string;

  @ApiProperty({
    example: 'member-uuid-456',
    description: 'ID of member who is receiving payment',
  })
  @IsUUID()
  receiverId: string;

  @ApiProperty({
    example: 2500,
    description: 'Amount in cents (e.g., 2500 = $25.00)',
  })
  @IsInt()
  @Min(1)
  amountInCents: number;
}
