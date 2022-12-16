import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddCardRequest {
  @IsNotEmpty()
  @IsString()
  number!: string;

  @IsNotEmpty()
  @IsString()
  expiration!: string;

  @IsOptional()
  @IsString()
  cvc!: string;
}
