import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupRequestDto {
  @ApiProperty({ example: 'Trip to Paris', description: 'Group name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(200)
  name: string;

  @ApiProperty({
    example: ['Alice', 'Bob', 'Charlie'],
    description: 'Initial member names',
  })
  @IsArray()
  @ArrayMinSize(2, { message: 'Group must have at least 2 members' })
  @IsString({ each: true })
  memberNames: string[];
}
