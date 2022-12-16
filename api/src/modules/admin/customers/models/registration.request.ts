import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsAppEmail()
  email!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsAppPassword()
  password!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsAppZipCode()
  zipCode!: string;

  @ApiProperty({ default: null })
  @IsOptional()
  @IsString()
  deviceToken!: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  deviceType!: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsAppName()
  name!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsAppSurname()
  surname!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  // @IsAppPhoneNumber()
  phoneNumber!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  // @IsAppWorkPhoneNumber()
  workPhoneNumber!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  // @Validate(IsAppAddress, { message: "Home address is not correct!" })
  homeAddress!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsAppGeoPosition()
  homePosition!: { lat: number; long: number };

  @ApiProperty()
  @IsOptional()
  @IsString()
  // @Validate(IsAppAddress, { message: "Billing address is not correct!" })
  billingAddress!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  // @IsAppCity()
  city!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  // @IsAppState()
  state!: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  // @IsAppEmergencyMany()
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
  // @IsAppMailbox()
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
  @IsBoolean()
  isSameAddress!: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  push!: boolean;

  @ApiProperty({ default: 1 })
  @IsNotEmpty()
  @IsNumber()
  status!: number;
}
