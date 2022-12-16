import { makePetInfoResponse, PetInfoResponse } from '@pawfect/models';
import { PetEntity } from '@pawfect/db/entities';


export interface PetProfileResponse extends PetInfoResponse {
}

export function makePetProfileResponse(petEntity: PetEntity): Promise<PetProfileResponse> {
  const response = makePetInfoResponse(petEntity);
  return response;
}
