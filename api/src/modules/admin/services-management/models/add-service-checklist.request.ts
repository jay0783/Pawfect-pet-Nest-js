import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class AddServiceChecklistRequest {
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
}
