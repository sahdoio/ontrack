import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddMemberRequestDto {
  @ApiProperty({ example: 'David', description: 'Member name to add' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  memberName: string;
}
