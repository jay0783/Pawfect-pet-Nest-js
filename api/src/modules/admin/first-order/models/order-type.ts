import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
export class SetOrderRequest {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  readonly type!: number;
}
