import { Injectable, InternalServerErrorException } from "@nestjs/common";

import { EmployeeEmergencyContactEntity, EmployeeEntity, UserEntity } from "@pawfect/db/entities";
import { EmployeeRepository } from "@pawfect/db/repositories";
import { EmergencyModel } from "@pawfect/models";
import { EditProfileRequest, GetProfileResponse } from "./models";


@Injectable()
export class ProfileService {
  constructor(private readonly employeeRepository: EmployeeRepository) { }


  async getProfile(userEntity: UserEntity, employeeEntity: EmployeeEntity): Promise<GetProfileResponse> {
    const emergencyEntities = await employeeEntity.emergencies;
    const avatarEntity = await employeeEntity.avatar;

    const profileResponse: GetProfileResponse = {
      id: employeeEntity.id,
      email: userEntity.email,
      name: employeeEntity.name,
      surname: employeeEntity.surname,
      imageUrl: avatarEntity?.url,
      phoneNumber: employeeEntity.phoneNumber,
      address: employeeEntity.address,
      workTimeFrom: employeeEntity.workTimeFrom,
      workTimeTo: employeeEntity.workTimeTo,
      jobRate: employeeEntity.jobRate,
      emergencies: emergencyEntities.map((e) => ({ id: e.id, name: e.name, phoneNumber: e.phoneNumber }))
    };

    return profileResponse;
  }
}
