import { EmployeeEntity } from '@pawfect/db/entities';


export interface GetEmployeeShortProfileResponse {
  id: string;
  name: string;
  surname: string;
  imageUrl?: string;
  workTimeFrom: number;
  workTimeTo: number;
  jobRate: number;
  email: string;
  phoneNumber: string;
  address: string;
  rate: number;
}

export async function makeGetEmployeeShortProfileResponse(employeeEntity: EmployeeEntity): Promise<GetEmployeeShortProfileResponse> {
  const employeeUser = await employeeEntity.user;
  const employeeAvatar = await employeeEntity.avatar;

  return {
    id: employeeEntity.id,
    name: employeeEntity.name,
    surname: employeeEntity.surname,
    imageUrl: employeeAvatar?.url,
    workTimeFrom: employeeEntity.workTimeFrom,
    workTimeTo: employeeEntity.workTimeTo,
    jobRate: employeeEntity.jobRate,
    email: employeeUser.email,
    phoneNumber: employeeEntity.phoneNumber,
    address: employeeEntity.address,
    rate: employeeEntity.rating,
  };
}
