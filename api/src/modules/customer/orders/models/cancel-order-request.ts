import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
export class CancelOrderRequest {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  readonly id!: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly reason?: string;
}
