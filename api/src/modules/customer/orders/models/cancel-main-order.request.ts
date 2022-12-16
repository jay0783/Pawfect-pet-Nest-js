import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { IsAppNotEmptyArray, IsAppVisitMany } from '@pawfect/validators';
export class CancelMainOrderRequest {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  readonly id!: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly reason?: string;

  @IsString({ each: true })
  @IsAppNotEmptyArray()
  readonly orderIds!: Array<string>;
}
