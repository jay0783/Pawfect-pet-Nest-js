import { IsNotEmpty, IsString } from 'class-validator';

import { IsAppZipCode } from '@pawfect/validators';
import { ApiProperty } from '@nestjs/swagger';

export class AddZipCodeRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsAppZipCode()
  readonly code!: string;
}
