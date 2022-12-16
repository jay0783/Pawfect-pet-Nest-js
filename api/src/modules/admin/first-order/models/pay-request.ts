import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
export class SetPayRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount!: number;
}
