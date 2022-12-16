import { IsNotEmpty } from 'class-validator';
import { IsAppName, IsAppPhoneNumber } from '@pawfect/validators';
import { ApiProperty } from '@nestjs/swagger';

export class AddEmergencyRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsAppName()
  name!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsAppPhoneNumber()
  phoneNumber!: string;
}
