import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class CustomSplitDto {
  @ApiProperty({ example: 'member-uuid-123' })
  @IsUUID()
  memberId: string;

  @ApiProperty({ example: 1000, description: 'Amount in cents' })
  @IsInt()
  @Min(1)
  amountInCents: number;
}

export class RecordExpenseRequestDto {
  @ApiProperty({
    example: 'member-uuid-456',
    description: 'ID of member who paid',
  })
  @IsUUID()
  payerId: string;

  @ApiProperty({ example: 'Dinner at restaurant', description: 'Expense name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 5000,
    description: 'Total amount in cents (e.g., 5000 = $50.00)',
  })
  @IsInt()
  @Min(1)
  amountInCents: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Split equally among all members',
  })
  @IsOptional()
  @IsBoolean()
  splitEqually?: boolean;

  @ApiPropertyOptional({
    type: [CustomSplitDto],
    description: 'Custom splits (if not splitting equally)',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomSplitDto)
  customSplits?: CustomSplitDto[];
}
