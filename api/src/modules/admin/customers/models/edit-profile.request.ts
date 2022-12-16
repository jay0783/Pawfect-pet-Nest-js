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
  IsAppZipCode,
} from '@pawfect/validators';
import { ApiProperty } from '@nestjs/swagger';

export class EditProfileRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsAppName()
  name!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsAppSurname()
  surname!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsAppPhoneNumber()
  phoneNumber!: string;

  @ApiProperty()
  // @IsNotEmpty()
  @IsOptional()
  @IsString()
  // @IsAppWorkPhoneNumber()
  workPhoneNumber!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  // @Validate(IsAppAddress, { message: "Home address is not correct!" })
  homeAddress!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsAppGeoPosition()
  homePosition!: GeoPositionModel;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  // @Validate(IsAppAddress, { message: "Billing address is not correct!" })
  billingAddress!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsAppCity()
  city!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsAppState()
  state!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsAppEmergencyMany({ idIsRequired: false })
  emergencies: Array<EmergencyModel> = [];

  @ApiProperty()
  @IsOptional()
  @IsString()
  // @IsAppLockboxDoorCode()
  lockboxDoorCode?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lockboxLocation?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  homeAlarmSystem?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  otherHomeAccessNotes?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  otherRequestNotes?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  mailbox?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isMailKeyProvided?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isTurnLight?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isSomeoneWillBeAtHome?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isWaterPlantsExists?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsAppAccountComment()
  comment?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(WeekDayEnum, { each: true })
  garbage: Array<WeekDayEnum> = [];

  @ApiProperty()
  @IsOptional()
  @IsEnum(HearAboutUsEnum)
  hearAboutUs!: HearAboutUsEnum;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  status!: number;

  @ApiProperty()
  @IsOptional()
  isSameAddress!: boolean;

  @ApiProperty()
  @IsOptional()
  deviceToken!: string;

  @ApiProperty()
  @IsOptional()
  deviceType!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsAppZipCode()
  zipCode!: string;
}
