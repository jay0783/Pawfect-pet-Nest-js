/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ApiProperty } from '@nestjs/swagger';
import { MAX_TIME_MILLIS, MIN_TIME_MILLIS } from '@pawfect/constants';
import { EmergencyModel } from '@pawfect/models';
import {
  IsAppAddress,
  IsAppEmail,
  IsAppEmergencyMany,
  IsAppName,
  IsAppPassword,
  IsAppPhoneNumber,
  IsAppSurname,
  IsAppZipCode,
} from '@pawfect/validators';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  Validate,
} from 'class-validator';

export class EditEmployeeRequest {
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
  @IsNumber()
  @Min(1)
  @Max(100)
  jobRate!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Max(MAX_TIME_MILLIS)
  @Min(MIN_TIME_MILLIS)
  @Validate((value: any, obj: any) => value < obj.timeTo)
  workTimeFrom!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Max(MAX_TIME_MILLIS)
  @Min(MIN_TIME_MILLIS)
  workTimeTo!: number;

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
  @IsAppPhoneNumber()
  phoneNumber!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  // @Validate(IsAppAddress, { message: "Home address is not correct!" })
  homeAddress!: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsAppEmergencyMany({ idIsRequired: false })
  emergencies: Array<EmergencyModel> = [];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsAppZipCode()
  zipCode!: string;
}
