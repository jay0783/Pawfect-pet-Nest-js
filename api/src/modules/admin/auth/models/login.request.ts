import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginRequest {
  @ApiProperty({ default: 'admin@pawfect.com' })
  @IsNotEmpty()
  login!: string;

  @ApiProperty({ default: '12345' })
  @IsNotEmpty()
  password!: string;
}
