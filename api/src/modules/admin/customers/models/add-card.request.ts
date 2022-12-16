import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddCardRequest {
  @ApiProperty({ default: null })
  @IsNotEmpty()
  @IsString()
  number!: string;

  @ApiProperty({ default: null })
  @IsNotEmpty()
  @IsString()
  expiration!: string;

  @ApiProperty({ default: null })
  @IsOptional()
  @IsString()
  cvc!: string;
}
