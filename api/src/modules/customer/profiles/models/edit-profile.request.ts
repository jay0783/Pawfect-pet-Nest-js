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
import { WeekDayEnum, HearAboutUsEnum } from '@pawfect/db/entities/enums';
import { EmergencyModel, GeoPositionModel } from '@pawfect/models';
import {
  IsAppAccountComment,
  IsAppAddress,
  IsAppCity,
  IsAppEmergencyMany,
  IsAppGeoPosition,
  IsAppHomeAccessNotes,
  IsAppHomeAlarmSystem,
  IsAppLockboxDoorCode,
  IsAppLockboxLocation,
  IsAppMailbox,
  IsAppName,
  IsAppOtherRequestNotes,
  IsAppPhoneNumber,
  IsAppState,
  IsAppSurname,
  IsAppWorkPhoneNumber,
} from '@pawfect/validators';

export class EditProfileRequest {
  @IsNotEmpty()
  @IsString()
  @IsAppName()
  name!: string;

  @IsNotEmpty()
  @IsString()
  @IsAppSurname()
  surname!: string;

  @IsNotEmpty()
  @IsString()
  @IsAppPhoneNumber()
  phoneNumber!: string;

  // @IsNotEmpty()
  @IsOptional()
  @IsString()
  // @IsAppWorkPhoneNumber()
  workPhoneNumber!: string;

  @IsNotEmpty()
  @IsString()
  // @Validate(IsAppAddress, { message: "Home address is not correct!" })
  homeAddress!: string;

  // @IsNotEmpty()
  @IsAppGeoPosition()
  homePosition!: GeoPositionModel;

  @IsNotEmpty()
  @IsString()
  // @Validate(IsAppAddress, { message: "Billing address is not correct!" })
  billingAddress!: string;

  @IsNotEmpty()
  @IsString()
  @IsAppCity()
  city!: string;

  @IsNotEmpty()
  @IsString()
  @IsAppState()
  state!: string;

  @IsNotEmpty()
  @IsArray()
  @IsAppEmergencyMany({ idIsRequired: false })
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
  @IsEnum(WeekDayEnum, { each: true })
  garbage: Array<WeekDayEnum> = [];

  @IsOptional()
  @IsEnum(HearAboutUsEnum)
  hearAboutUs!: HearAboutUsEnum;

  @IsNotEmpty()
  @IsNumber()
  status!: number;

  @IsOptional()
  isSameAddress!: boolean;

  @IsOptional()
  deviceToken!: string;

  @IsOptional()
  deviceType!: number;
}
