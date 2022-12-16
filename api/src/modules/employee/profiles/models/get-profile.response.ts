import { EmergencyModel } from "@pawfect/models";


export interface GetProfileResponse {
  id: string;
  email: string;
  name: string;
  surname: string;
  imageUrl?: string;
  workTimeFrom: number;
  workTimeTo: number;
  jobRate: number;
  phoneNumber: string;
  address: string;
  emergencies: Array<EmergencyModel>;
}
