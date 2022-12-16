import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsAppEmail, IsAppPassword } from '@pawfect/validators';

export class LoginRequest {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @IsAppEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @IsAppPassword()
  password!: string;

  @IsNotEmpty()
  @IsString()
  deviceToken!: string;

  @IsNotEmpty()
  @IsNumber()
  deviceType!: number;

  @IsOptional()
  @IsBoolean()
  push!: boolean;
}
