import { IsAppTimestamp } from '@pawfect/validators';
import { IsNumber, IsString } from 'class-validator';

export interface addtimeBlockRequestModel {
  title: string;
  timeFrom: number;
  timeTo: number;
}

export class AddTimeBLockRequest implements addtimeBlockRequestModel {
  @IsString()
  title: string;

  @IsNumber()
  @IsAppTimestamp()
  timeFrom: number;

  @IsNumber()
  @IsAppTimestamp()
  timeTo: number;
}
