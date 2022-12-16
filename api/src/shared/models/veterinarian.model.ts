import { IsAppName, IsAppVeterinarianPhoneNumber } from '@pawfect/validators';
import { IsOptional, IsUUID } from 'class-validator';

export interface VeterinarianModel {
  id?: string;
  name: string;
  phoneNumber: string;
}

export class VeterinarianRequest implements VeterinarianModel {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsAppName()
  name!: string;

  @IsAppVeterinarianPhoneNumber()
  phoneNumber!: string;
}
