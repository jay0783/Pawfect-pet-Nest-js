import { WeekDayEnum } from '@pawfect/db/entities/customer/enums';
import {
  CustomerEntity,
  CustomerHomeInfoEntity,
  PhotoEntity,
  UserEntity,
  ZipCodeEntity,
} from '@pawfect/db/entities';

export interface CustomerInfoResponse {
  name: string;
  surname: string;
  email: string;
  imageUrl?: string;
  phoneNumber: string;
  workPhoneNumber: string;
  homePosition: { lat: number; long: number };
  address: string;
  billingAddress: string;
  city: string;
  state: string;
  zipCode: string;
  lockboxDoorCode?: string | null;
  lockboxLocation?: string | null;
  homeAlarmSystem?: string | null;
  otherHomeAccessNotes?: string | null;
  mailbox?: string | null;
  otherRequests?: string | null;
  isMailKeyProvided?: boolean;
  isSomeoneWillBeAtHome?: boolean;
  isWaterPlantsExists?: boolean;
  comment?: string | null;
  garbages: WeekDayEnum[];
  isTurnLight?: boolean;
  emergencies: {};
  status: number;
}

export async function makeCustomerInfoResponse(
  customerEntity: CustomerEntity,
): Promise<CustomerInfoResponse> {
  const customerUser: UserEntity = await customerEntity.user;
  const zipCodeEntity: ZipCodeEntity = await customerEntity.zipCode;
  const customerHomeEntity:
    | CustomerHomeInfoEntity
    | undefined = await customerEntity.homeInfo;
  const avatarEntity: PhotoEntity | undefined = await customerEntity.avatar;
  const emergencyEntities = await customerEntity.emergencies;

  return {
    name: customerEntity.name,
    surname: customerEntity.surname,
    imageUrl: avatarEntity?.url,
    email: customerUser.email,
    // password:customerUser.pass
    phoneNumber: customerEntity.phoneNumber,
    workPhoneNumber: customerEntity.workPhoneNumber,
    homePosition: {
      lat: customerEntity.addressPosition.coordinates[0],
      long: customerEntity.addressPosition.coordinates[1],
    },
    address: customerEntity.address,
    billingAddress: customerEntity.billingAddress,
    city: customerEntity.city,
    state: customerEntity.state,
    zipCode: zipCodeEntity.zipCode,
    lockboxDoorCode: customerHomeEntity?.lockboxCode,
    lockboxLocation: customerHomeEntity?.lockboxLocation,
    homeAlarmSystem: customerHomeEntity?.homeAlarmSystem,
    otherHomeAccessNotes: customerHomeEntity?.homeAccessNotes,
    mailbox: customerHomeEntity?.mailbox,
    otherRequests: customerHomeEntity?.otherRequest,
    isMailKeyProvided: customerHomeEntity?.isMailKeyProvided,
    isSomeoneWillBeAtHome: customerHomeEntity?.isSomeoneWillBeAtHome,
    isWaterPlantsExists: customerHomeEntity?.isWaterPlantExists,
    comment: customerEntity.comment,
    garbages: customerHomeEntity?.trashPickUps || [],
    isTurnLight: customerHomeEntity?.isTurnOnLight,
    emergencies: emergencyEntities.map((e) => ({
      id: e.id,
      name: e.name,
      phoneNumber: e.phoneNumber,
    })),
    status: customerEntity.status,
  };
}
