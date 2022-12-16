import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateServiceChecklistRequest {
  // @IsUUID()
  // readonly id!: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  readonly name!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly duration!: number;

  @ApiProperty()
  @IsOptional()
  readonly blocked!: boolean;
}
