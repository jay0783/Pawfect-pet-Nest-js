import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
export class NotificationRequest {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly itemId!: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly notificationTitle?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly notificationMsg?: string;

  @IsOptional()
  @IsUUID()
  readonly customer?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly body?: string;

  @IsOptional()
  @IsUUID()
  readonly employee?: string;
}
