import {
  Body, Controller, Get, InternalServerErrorException, Patch, Req, UseGuards
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

import { EmployeeEntity, UserEntity } from "@pawfect/db/entities";
import { SuccessModel } from "@pawfect/models";
import { GetProfileResponse } from "./models";
import { ProfileService } from "./profile.service";


@Controller("employee/profiles")
@UseGuards(AuthGuard("employee-jwt"))
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }


  @Get("my")
  async getProfile(@Req() req: Request): Promise<GetProfileResponse> {
    const userEntity: UserEntity = req.getAuthEntity();
    const employeeEntity: EmployeeEntity | undefined = await userEntity.employee;
    if (!employeeEntity) {
      throw new InternalServerErrorException("employee was not found on this user");
    }

    const profileResponse: GetProfileResponse = await this.profileService.getProfile(userEntity, employeeEntity);
    return profileResponse;
  }
}
