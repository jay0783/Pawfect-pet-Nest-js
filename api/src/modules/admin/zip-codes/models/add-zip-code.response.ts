import { ZipCodeEntity } from '@pawfect/db/entities';
import { makeZipCodeViewModel, ZipCodeViewModel } from './zip-code.vm';


export interface AddZipCodeResponse extends ZipCodeViewModel {
}

export async function makeAddZipCodeResponse(zipCodeEntity: ZipCodeEntity): Promise<AddZipCodeResponse> {
  return makeZipCodeViewModel(zipCodeEntity);
}
