import { EmergencyModel } from '@pawfect/models';
import {
  EmployeeEmergencyContactEntity,
  EmployeeEntity,
  PhotoEntity,
  UserEntity,
  ZipCodeEntity,
} from '@pawfect/db/entities';


export interface GetEmployeeFullProfileResponse {
  id: string;
  name: string;
  surname: string;
  imageUrl?: string | null;
  workTimeFrom: number;
  workTimeTo: number;
  jobRate: number;
  email: string;
  phoneNumber: string;
  address: string;
  rate: number;
  emergencies: EmergencyModel[];
  zipCode: string;
}

export async function makeGetEmployeeFullProfileResponse(employeeEntity: EmployeeEntity): Promise<GetEmployeeFullProfileResponse> {
  const employeeUser: UserEntity = await employeeEntity.user;
  const employeeAvatar: PhotoEntity | undefined = await employeeEntity.avatar;
  const employeeEmergenciesEntities: EmployeeEmergencyContactEntity[] = await employeeEntity.emergencies;
  const employeeZipCode: ZipCodeEntity = await employeeEntity.zipCode;
  const emergencies: EmergencyModel[] = employeeEmergenciesEntities.map(emergency => ({
    id: emergency.id,
    name: emergency.name,
    phoneNumber: emergency.phoneNumber,
  }));

  return {
    id: employeeEntity.id,
    name: employeeEntity.name,
    surname: employeeEntity.surname,
    imageUrl: employeeAvatar?.url || null,
    workTimeFrom: employeeEntity.workTimeFrom,
    workTimeTo: employeeEntity.workTimeTo,
    jobRate: employeeEntity.jobRate,
    email: employeeUser.email,
    phoneNumber: employeeEntity.phoneNumber,
    address: employeeEntity.address,
    rate: employeeEntity.rating,
    emergencies: emergencies,
    zipCode: employeeZipCode.zipCode,
  };
}
