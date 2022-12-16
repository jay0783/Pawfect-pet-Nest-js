import { HearAboutUsEnum, WeekDayEnum } from '@pawfect/db/entities/enums';
import { EmergencyModel } from '@pawfect/models';
import {
  IsAppAccountComment,
  IsAppAddress,
  IsAppCity,
  IsAppEmail,
  IsAppEmergencyMany,
  IsAppGeoPosition,
  IsAppLockboxDoorCode,
  IsAppMailbox,
  IsAppName,
  IsAppPassword,
  IsAppPhoneNumber,
  IsAppState,
  IsAppSurname,
  IsAppZipCode,
  IsAppWorkPhoneNumber,
} from '@pawfect/validators';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';

export class RegistrationRequest {
  @IsNotEmpty()
  @IsString()
  @IsAppEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @IsAppPassword()
  password!: string;

  @IsNotEmpty()
  @IsString()
  @IsAppZipCode()
  zipCode!: string;

  @IsNotEmpty()
  @IsString()
  deviceToken!: string;

  @IsNotEmpty()
  @IsNumber()
  deviceType!: number;

  @IsOptional()
  @IsString()
  @IsAppName()
  name!: string;

  @IsOptional()
  @IsString()
  @IsAppSurname()
  surname!: string;

  @IsOptional()
  @IsString()
  // @IsAppPhoneNumber()
  phoneNumber!: string;

  @IsOptional()
  @IsString()
  // @IsAppWorkPhoneNumber()
  workPhoneNumber!: string;

  @IsOptional()
  @IsString()
  // @Validate(IsAppAddress, { message: "Home address is not correct!" })
  homeAddress!: string;

  @IsOptional()
  @IsAppGeoPosition()
  homePosition!: { lat: number; long: number };

  @IsOptional()
  @IsString()
  // @Validate(IsAppAddress, { message: "Billing address is not correct!" })
  billingAddress!: string;

  @IsOptional()
  @IsString()
  // @IsAppCity()
  city!: string;

  @IsOptional()
  @IsString()
  // @IsAppState()
  state!: string;

  @IsOptional()
  @IsArray()
  // @IsAppEmergencyMany()
  emergencies: Array<EmergencyModel> = [];

  @IsOptional()
  @IsString()
  // @IsAppLockboxDoorCode()
  lockboxDoorCode?: string;

  @IsOptional()
  @IsString()
  lockboxLocation?: string;

  @IsOptional()
  @IsString()
  homeAlarmSystem?: string;

  @IsOptional()
  @IsString()
  otherHomeAccessNotes?: string;

  @IsOptional()
  @IsString()
  otherRequestNotes?: string;

  @IsOptional()
  @IsString()
  // @IsAppMailbox()
  mailbox?: string;

  @IsOptional()
  @IsBoolean()
  isMailKeyProvided?: boolean;

  @IsOptional()
  @IsBoolean()
  isTurnLight?: boolean;

  @IsOptional()
  @IsBoolean()
  isSomeoneWillBeAtHome?: boolean;

  @IsOptional()
  @IsBoolean()
  isWaterPlantsExists?: boolean;

  @IsOptional()
  @IsString()
  @IsAppAccountComment()
  comment?: string;

  @IsOptional()
  @IsEnum(HearAboutUsEnum)
  hearAboutUs!: HearAboutUsEnum;

  @IsOptional()
  @IsEnum(WeekDayEnum, { each: true })
  garbage: Array<WeekDayEnum> = [];

  @IsOptional()
  @IsBoolean()
  isSameAddress!: boolean;

  @IsOptional()
  @IsBoolean()
  push!: boolean;
}
