import {
  IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString
} from "class-validator";
import { EmergencyModel } from "@pawfect/models";
import { IsAppEmergencyMany } from "@pawfect/validators";


export class EditProfileRequest {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  surname?: string;

  @IsOptional()
  @IsNumber()
  timeFrom?: number;

  @IsOptional()
  @IsNumber()
  timeTo?: number;

  @IsOptional()
  @IsString()
  @IsPhoneNumber(undefined)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  homeAddress?: string;

  @IsOptional()
  @IsAppEmergencyMany()
  emergencies: Array<EmergencyModel> = [];
}
