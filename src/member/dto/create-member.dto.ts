import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateMemberDto implements Readonly<CreateMemberDto> {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: true,
    minLength: 6,
    maxLength: 20,
    uniqueItems: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  username: string;

  @ApiProperty({
    required: true,
    minLength: 12,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(12)
  @MaxLength(20)
  password: string;
}
